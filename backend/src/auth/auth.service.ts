import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Role } from '../common/enums/role.enum';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    private readonly jwtService: JwtService,
  ) {}

  /** Normal user self-registration — role is forced to NORMAL_USER */
  async signup(dto: SignupDto): Promise<{ accessToken: string }> {
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
      address: dto.address,
      role: dto.role || Role.NORMAL_USER, 
    });

    const saved = await this.userRepo.save(user);

    if (saved.role === Role.STORE_OWNER) {
      if (!dto.storeName || !dto.storeEmail || !dto.storeAddress) {
        throw new ConflictException('Store name, email, and address are required for Store Owners');
      }
      const existingStore = await this.storeRepo.findOne({ where: { email: dto.storeEmail } });
      if (existingStore) {
        throw new ConflictException('A store with this email already exists');
      }
      const store = this.storeRepo.create({
        name: dto.storeName,
        email: dto.storeEmail,
        address: dto.storeAddress,
        ownerId: saved.id,
      });
      await this.storeRepo.save(store);
    }

    return this.generateToken(saved);
  }

  /** Single login endpoint for all roles */
  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateToken(user);
  }

  /** Change password for any logged-in user */
  async changePassword(
    userId: number,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const currentValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Password updated successfully' };
  }

  private generateToken(user: User): { accessToken: string } {
    const payload = { sub: user.id, role: user.role, name: user.name, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
