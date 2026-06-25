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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const store_entity_1 = require("../stores/entities/store.entity");
const rating_entity_1 = require("../ratings/entities/rating.entity");
let DashboardService = class DashboardService {
    constructor(userRepo, storeRepo, ratingRepo) {
        this.userRepo = userRepo;
        this.storeRepo = storeRepo;
        this.ratingRepo = ratingRepo;
    }
    async getAdminDashboard() {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            this.userRepo.count(),
            this.storeRepo.count(),
            this.ratingRepo.count(),
        ]);
        return { totalUsers, totalStores, totalRatings };
    }
    async getStoreOwnerDashboard(ownerId) {
        const store = await this.storeRepo.findOne({
            where: { ownerId },
        });
        if (!store) {
            return {
                storeName: 'No store assigned',
                averageRating: 0,
                ratings: [],
            };
        }
        const ratings = await this.ratingRepo
            .createQueryBuilder('r')
            .innerJoin('r.user', 'u')
            .select([
            'u.name as "userName"',
            'u.email as "userEmail"',
            'r.rating as "rating"',
            'r.created_at as "createdAt"',
        ])
            .where('r.store_id = :storeId', { storeId: store.id })
            .orderBy('r.created_at', 'DESC')
            .getRawMany();
        const avgResult = await this.ratingRepo
            .createQueryBuilder('r')
            .select('COALESCE(AVG(r.rating), 0)', 'avg')
            .where('r.store_id = :storeId', { storeId: store.id })
            .getRawOne();
        return {
            storeName: store.name,
            averageRating: parseFloat(avgResult?.avg || '0'),
            ratings,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(2, (0, typeorm_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map