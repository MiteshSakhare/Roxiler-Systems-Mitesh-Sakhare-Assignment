import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<Omit<import("./entities/user.entity").User, "passwordHash">>;
    findAll(filters: FilterUserDto): Promise<Omit<import("./entities/user.entity").User, "passwordHash">[]>;
    findOne(id: number): Promise<Record<string, unknown>>;
}
