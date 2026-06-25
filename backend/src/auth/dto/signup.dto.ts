import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(60, { message: 'Name must not exceed 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/, {
    message:
      'Password must be 8-16 characters with at least one uppercase letter and one special character',
  })
  password: string;

  @IsString()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address: string;

  @IsOptional()
  @IsEnum([Role.NORMAL_USER, Role.STORE_OWNER], {
    message: 'Role must be either NORMAL_USER or STORE_OWNER',
  })
  role?: Role;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  storeName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid store email address' })
  storeEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  storeAddress?: string;
}
