import { IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class UpsertRatingDto {
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;
}
