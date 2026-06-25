import { IsIn, IsOptional, IsString } from 'class-validator';

export class FilterStoreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsIn(['name', 'email', 'address', 'averageRating', 'createdAt'], {
    message:
      'sortBy must be one of: name, email, address, averageRating, createdAt',
  })
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
    message: 'sortOrder must be ASC or DESC',
  })
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
