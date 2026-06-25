import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
export declare class StoresController {
    private readonly storesService;
    constructor(storesService: StoresService);
    create(dto: CreateStoreDto): Promise<import("./entities/store.entity").Store>;
    findAllAdmin(filters: FilterStoreDto): Promise<Record<string, unknown>[]>;
    findAllForUser(userId: number, name?: string, address?: string): Promise<Record<string, unknown>[]>;
}
