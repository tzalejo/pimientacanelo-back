import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';

import { Product } from './Product';

@Entity()
export class Ingredient extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @ManyToOne(() => Product, (product) => product.ingredients)
    product: Product;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
