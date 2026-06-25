import { Role } from '../../common/enums/role.enum';
export declare class FilterUserDto {
    name?: string;
    email?: string;
    address?: string;
    role?: Role;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
