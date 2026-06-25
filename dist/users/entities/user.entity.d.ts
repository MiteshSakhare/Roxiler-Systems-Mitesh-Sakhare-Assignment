import { Role } from '../../common/enums/role.enum';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
    address: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    ratings: Rating[];
    ownedStore: Store;
}
