import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class FilterUserDto {
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
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsIn(['name', 'email', 'address', 'role', 'createdAt'], {
    message: 'sortBy must be one of: name, email, address, role, createdAt',
  })
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'], {
    message: 'sortOrder must be ASC or DESC',
  })
  sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
