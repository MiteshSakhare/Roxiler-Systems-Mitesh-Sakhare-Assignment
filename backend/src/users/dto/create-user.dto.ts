import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
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
  @IsOptional()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address?: string;

  @IsEnum(Role, { message: 'Role must be ADMIN, NORMAL_USER, or STORE_OWNER' })
  @IsNotEmpty({ message: 'Role is required' })
  role: Role;
}
