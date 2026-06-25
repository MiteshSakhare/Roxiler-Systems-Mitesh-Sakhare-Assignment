import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';
export declare class DashboardService {
    private readonly userRepo;
    private readonly storeRepo;
    private readonly ratingRepo;
    constructor(userRepo: Repository<User>, storeRepo: Repository<Store>, ratingRepo: Repository<Rating>);
    getAdminDashboard(): Promise<{
        totalUsers: number;
        totalStores: number;
        totalRatings: number;
    }>;
    getStoreOwnerDashboard(ownerId: number): Promise<{
        storeName: string;
        averageRating: number;
        ratings: Array<{
            userName: string;
            userEmail: string;
            rating: number;
            createdAt: Date;
        }>;
    }>;
}
