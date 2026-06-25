import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Rating } from '../../ratings/entities/rating.entity';
import { Store } from '../../stores/entities/store.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60, nullable: false })
  name: string;

  @Index('IDX_USERS_EMAIL')
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  /** Never returned in API responses — stripped via response serialization */
  @Column({ type: 'varchar', nullable: false, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToOne(() => Store, (store) => store.owner)
  ownedStore: Store;
}
