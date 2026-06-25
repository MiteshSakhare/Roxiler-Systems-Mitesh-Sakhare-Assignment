import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';
import { UpsertRatingDto } from './dto/upsert-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  /**
   * Upsert a user's rating for a store.
   * Uses the UNIQUE(user_id, store_id) constraint to either
   * insert a new row or update the existing one.
   */
  async upsertRating(
    userId: number,
    storeId: number,
    dto: UpsertRatingDto,
  ): Promise<Rating> {
    // Verify store exists
    const store = await this.storeRepo.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    // Check for existing rating by this user for this store
    let existing = await this.ratingRepo.findOne({
      where: { userId, storeId },
    });

    if (existing) {
      existing.rating = dto.rating;
      return this.ratingRepo.save(existing);
    }

    const rating = this.ratingRepo.create({
      userId,
      storeId,
      rating: dto.rating,
    });

    return this.ratingRepo.save(rating);
  }
}
