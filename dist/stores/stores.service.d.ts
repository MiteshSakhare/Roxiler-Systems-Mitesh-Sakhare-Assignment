import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from '../users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
export declare class StoresService {
    private readonly storeRepo;
    private readonly userRepo;
    constructor(storeRepo: Repository<Store>, userRepo: Repository<User>);
    create(dto: CreateStoreDto): Promise<Store>;
    findAllAdmin(filters: FilterStoreDto): Promise<Record<string, unknown>[]>;
    findAllForUser(userId: number, filters: {
        name?: string;
        address?: string;
    }): Promise<Record<string, unknown>[]>;
}
