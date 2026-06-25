import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Admin creates a user of any role */
  async create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      address: dto.address || '',
      role: dto.role,
    });

    const saved = await this.userRepo.save(user);
    return this.stripPassword(saved);
  }

  /** Filtered + sorted user listing for admin */
  async findAll(filters: FilterUserDto): Promise<Omit<User, 'passwordHash'>[]> {
    const qb = this.userRepo.createQueryBuilder('user');

    if (filters.name) {
      qb.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
    }
    if (filters.email) {
      qb.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
    }
    if (filters.address) {
      qb.andWhere('user.address ILIKE :address', {
        address: `%${filters.address}%`,
      });
    }
    if (filters.role) {
      qb.andWhere('user.role = :role', { role: filters.role });
    }

    // sortBy is validated against an allow-list in the DTO to prevent injection
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = (filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'ASC';
    qb.orderBy(`user.${sortBy}`, sortOrder);

    const users = await qb.getMany();
    return users.map((u) => this.stripPassword(u));
  }

  /** Full user detail; includes store avg rating for STORE_OWNER */
  async findOneDetail(id: number): Promise<Record<string, unknown>> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result: Record<string, unknown> = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt,
    };

    // If the user is a store owner, also fetch their store's average rating
    if (user.role === Role.STORE_OWNER) {
      const storeData = await this.userRepo.manager.query(
        `SELECT s.id, s.name, s.email, s.address,
                COALESCE(AVG(r.rating), 0) as "averageRating"
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1
         GROUP BY s.id`,
        [id],
      );
      result.store = storeData.length > 0 ? storeData[0] : null;
    }

    return result;
  }

  private stripPassword(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest as Omit<User, 'passwordHash'>;
  }
}
