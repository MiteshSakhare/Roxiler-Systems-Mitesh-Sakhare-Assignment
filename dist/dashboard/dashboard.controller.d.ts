import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
