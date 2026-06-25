import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: Record<string, jest.Mock>;
  let mockJwtService: Record<string, jest.Mock>;

  const mockUser: Partial<User> = {
    id: 1,
    name: 'Test User With Long Name',
    email: 'test@example.com',
    passwordHash: '',
    role: Role.NORMAL_USER,
  };

  beforeEach(async () => {
    // Pre-hash a known password for comparison tests
    mockUser.passwordHash = await bcrypt.hash('Test@1234', 10);

    mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn().mockReturnValue(mockUser),
      save: jest.fn().mockResolvedValue(mockUser),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.login({
        email: 'test@example.com',
        password: 'Test@1234',
      });
      expect(result).toEqual({ accessToken: 'mock-jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPass!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent email', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(
        service.login({ email: 'nobody@example.com', password: 'Test@1234' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signup', () => {
    it('should throw ConflictException if email already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(
        service.signup({
          name: 'A Name That Is At Least 20',
          email: 'test@example.com',
          password: 'Test@1234',
          address: '123 Street',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create user and return token for valid signup', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      const result = await service.signup({
        name: 'A Name That Is At Least 20',
        email: 'new@example.com',
        password: 'Test@1234',
        address: '123 Street',
      });
      expect(result).toEqual({ accessToken: 'mock-jwt-token' });
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ role: Role.NORMAL_USER }),
      );
    });
  });

  describe('changePassword', () => {
    it('should throw if current password is wrong', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      await expect(
        service.changePassword(1, {
          currentPassword: 'Wrong@123',
          newPassword: 'NewPass@1234',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
