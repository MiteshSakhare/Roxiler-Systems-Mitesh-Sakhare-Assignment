import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Store } from '../stores/entities/store.entity';
import { Rating } from '../ratings/entities/rating.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
  ) {}

  async getAdminDashboard(): Promise<{
    totalUsers: number;
    totalStores: number;
    totalRatings: number;
    totalOwners: number;
    totalNormalUsers: number;
    averagePlatformRating: number;
    recentUsers: User[];
  }> {
    const [totalUsers, totalStores, totalRatings, totalOwners, totalNormalUsers] = await Promise.all([
      this.userRepo.count(),
      this.storeRepo.count(),
      this.ratingRepo.count(),
      this.userRepo.count({ where: { role: 'STORE_OWNER' as any } }),
      this.userRepo.count({ where: { role: 'NORMAL_USER' as any } }),
    ]);

    const avgResult = await this.ratingRepo
      .createQueryBuilder('r')
      .select('COALESCE(AVG(r.rating), 0)', 'avg')
      .getRawOne();

    const recentUsers = await this.userRepo.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return { 
      totalUsers, totalStores, totalRatings, totalOwners, totalNormalUsers,
      averagePlatformRating: parseFloat(avgResult?.avg || '0'),
      recentUsers 
    };
  }

  /**
   * Store owner dashboard: lists all users who rated their store,
   * plus the store's overall average rating.
   * Only returns data for the store owned by the requesting user.
   */
  async getStoreOwnerDashboard(ownerId: number): Promise<{
    storeName: string;
    averageRating: number;
    ratings: Array<{
      userName: string;
      userEmail: string;
      rating: number;
      createdAt: Date;
    }>;
  }> {
    // Find the store owned by this user
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

    // Get all ratings with user info
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

    // Average rating via SQL
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
}
