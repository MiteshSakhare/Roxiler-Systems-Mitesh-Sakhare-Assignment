import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty({ message: 'Store name is required' })
  @MinLength(2, { message: 'Store name must be at least 2 characters' })
  @MaxLength(60, { message: 'Store name must not exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address?: string;

  @IsInt({ message: 'Owner ID must be a valid integer' })
  @IsNotEmpty({ message: 'Owner ID is required' })
  ownerId: number;
}
