import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    BaseEntity,
} from 'typeorm';

import { Product } from './Product';

@Entity()
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
