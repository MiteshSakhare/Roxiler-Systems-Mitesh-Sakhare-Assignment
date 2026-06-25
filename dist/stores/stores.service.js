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
exports.StoresService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
const user_entity_1 = require("../users/entities/user.entity");
const role_enum_1 = require("../common/enums/role.enum");
let StoresService = class StoresService {
    constructor(storeRepo, userRepo) {
        this.storeRepo = storeRepo;
        this.userRepo = userRepo;
    }
    async create(dto) {
        const owner = await this.userRepo.findOne({
            where: { id: dto.ownerId },
        });
        if (!owner) {
            throw new common_1.NotFoundException('Owner user not found');
        }
        if (owner.role !== role_enum_1.Role.STORE_OWNER) {
            throw new common_1.BadRequestException('The assigned owner must have the STORE_OWNER role');
        }
        const store = this.storeRepo.create({
            name: dto.name,
            email: dto.email,
            address: dto.address || '',
            ownerId: dto.ownerId,
        });
        return this.storeRepo.save(store);
    }
    async findAllAdmin(filters) {
        let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id as "ownerId",
             s.created_at as "createdAt",
             COALESCE(AVG(r.rating), 0) as "averageRating"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
    `;
        const conditions = [];
        const params = [];
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
        query += ' GROUP BY s.id';
        const sortColumnMap = {
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
    async findAllForUser(userId, filters) {
        let query = `
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as "averageRating",
             (SELECT r2.rating FROM ratings r2
              WHERE r2.store_id = s.id AND r2.user_id = $1) as "userRating"
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
    `;
        const conditions = [];
        const params = [userId];
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
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StoresService);
//# sourceMappingURL=stores.service.js.map