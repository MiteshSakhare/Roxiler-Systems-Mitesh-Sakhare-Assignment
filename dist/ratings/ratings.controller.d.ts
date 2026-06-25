import { RatingsService } from './ratings.service';
import { UpsertRatingDto } from './dto/upsert-rating.dto';
export declare class RatingsController {
    private readonly ratingsService;
    constructor(ratingsService: RatingsService);
    upsertRating(userId: number, storeId: number, dto: UpsertRatingDto): Promise<import("./entities/rating.entity").Rating>;
}
