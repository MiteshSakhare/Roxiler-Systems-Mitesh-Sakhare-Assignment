import { User } from '../../users/entities/user.entity';
import { Store } from '../../stores/entities/store.entity';
export declare class Rating {
    id: number;
    userId: number;
    storeId: number;
    rating: number;
    user: User;
    store: Store;
    createdAt: Date;
    updatedAt: Date;
}
