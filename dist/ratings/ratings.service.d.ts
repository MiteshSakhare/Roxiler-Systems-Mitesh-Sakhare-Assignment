import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { Store } from '../stores/entities/store.entity';
import { UpsertRatingDto } from './dto/upsert-rating.dto';
export declare class RatingsService {
    private readonly ratingRepo;
    private readonly storeRepo;
    constructor(ratingRepo: Repository<Rating>, storeRepo: Repository<Store>);
    upsertRating(userId: number, storeId: number, dto: UpsertRatingDto): Promise<Rating>;
}
