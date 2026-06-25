import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Admin creates a store linked to a STORE_OWNER user */
  async create(dto: CreateStoreDto): Promise<Store> {
    const owner = await this.userRepo.findOne({
      where: { id: dto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }
    if (owner.role !== Role.STORE_OWNER) {
      throw new BadRequestException(
        'The assigned owner must have the STORE_OWNER role',
      );
    }

    const store = this.storeRepo.create({
      name: dto.name,
      email: dto.email,
      address: dto.address || '',
      ownerId: dto.ownerId,
    });

    return this.storeRepo.save(store);
  }

  /**
   * Admin store listing with computed average rating.
   * AVG is computed in SQL for scalability rather than in-memory.
   */
  async findAllAdmin(filters: FilterStoreDto): Promise<Record<string, unknown>[]> {
    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id as "ownerId",
             u.name as "ownerName", u.email as "ownerEmail",
             s.created_at as "createdAt",
             COALESCE(AVG(r.rating), 0) as "averageRating"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN users u ON s.owner_id = u.id
    `;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters.name) {
      conditions.push(`s.name ILIKE $${paramIndex++}`);
      params.push(`%${filters.name}%`);
    }
    if (filters.email) {
      conditions.push(`s.email ILIKE $${paramIndex++}`);
      params.push(`%${filters.email}%`);
    }
    if (filters.address) {
      conditions.push(`s.address ILIKE $${paramIndex++}`);
      params.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id, u.name, u.email';

    // Sort — defaults validated against allow-list in the DTO
    const sortColumnMap: Record<string, string> = {
      name: 's.name',
      email: 's.email',
      address: 's.address',
      averageRating: '"averageRating"',
      createdAt: 's.created_at',
    };
    const sortCol = sortColumnMap[filters.sortBy || 'createdAt'] || 's.created_at';
    const sortDir = filters.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortCol} ${sortDir}`;

    return this.storeRepo.manager.query(query, params);
  }

  /**
   * Normal user store listing: includes average rating + user's own rating.
   * Both computed via SQL aggregates/subqueries.
   */
  async findAllForUser(
    userId: number,
    filters: { name?: string; address?: string },
  ): Promise<Record<string, unknown>[]> {
    let query = `
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as "averageRating",
             (SELECT r2.rating FROM ratings r2
              WHERE r2.store_id = s.id AND r2.user_id = $1) as "userRating"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
    `;

    const conditions: string[] = [];
    const params: unknown[] = [userId];
    let paramIndex = 2;

    if (filters.name) {
      conditions.push(`s.name ILIKE $${paramIndex++}`);
      params.push(`%${filters.name}%`);
    }
    if (filters.address) {
      conditions.push(`s.address ILIKE $${paramIndex++}`);
      params.push(`%${filters.address}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id ORDER BY s.name ASC';

    return this.storeRepo.manager.query(query, params);
  }

  /**
   * Admin store detail with computed average rating.
   */
  async findOneAdmin(id: number): Promise<Record<string, unknown>> {
    const query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id as "ownerId",
             u.name as "ownerName", u.email as "ownerEmail",
             s.created_at as "createdAt",
             COALESCE(AVG(r.rating), 0) as "averageRating"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE s.id = $1
      GROUP BY s.id, u.name, u.email
    `;
    const result = await this.storeRepo.manager.query(query, [id]);
    
    if (!result || result.length === 0) {
      throw new NotFoundException('Store not found');
    }
    
    return result[0];
  }
}
