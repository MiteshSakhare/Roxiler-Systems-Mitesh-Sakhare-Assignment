import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
export declare class UsersService {
    private readonly userRepo;
    constructor(userRepo: Repository<User>);
    create(dto: CreateUserDto): Promise<Omit<User, 'passwordHash'>>;
    findAll(filters: FilterUserDto): Promise<Omit<User, 'passwordHash'>[]>;
    findOneDetail(id: number): Promise<Record<string, unknown>>;
    private stripPassword;
}
