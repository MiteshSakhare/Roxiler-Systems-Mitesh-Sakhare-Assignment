"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
const role_enum_1 = require("../common/enums/role.enum");
let UsersService = class UsersService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async create(dto) {
        const existing = await this.userRepo.findOne({
            where: { email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('A user with this email already exists');
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
    async findAll(filters) {
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
        const sortBy = filters.sortBy || 'createdAt';
        const sortOrder = filters.sortOrder?.toUpperCase() || 'ASC';
        qb.orderBy(`user.${sortBy}`, sortOrder);
        const users = await qb.getMany();
        return users.map((u) => this.stripPassword(u));
    }
    async findOneDetail(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const result = {
            id: user.id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
            createdAt: user.createdAt,
        };
        if (user.role === role_enum_1.Role.STORE_OWNER) {
            const storeData = await this.userRepo.manager.query(`SELECT s.id, s.name, s.email, s.address,
                COALESCE(AVG(r.rating), 0) as "averageRating"
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = $1
         GROUP BY s.id`, [id]);
            result.store = storeData.length > 0 ? storeData[0] : null;
        }
        return result;
    }
    stripPassword(user) {
        const { passwordHash, ...rest } = user;
        return rest;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map