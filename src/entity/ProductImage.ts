import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    BaseEntity,
} from 'typeorm';

import { Product } from './Product';

@Entity()
export class ProductImage extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    @ManyToOne(() => Product, (product) => product.productImages)
    product: Product;

    @Column()
    fileName: string;

    @Column()
    fileExtension: string;

    @Column()
    fileMimiType: string;

    @Column()
    fileSize: number;

    @Column()
    path: string;
}
