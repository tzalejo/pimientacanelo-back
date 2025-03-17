import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    BaseEntity,
} from 'typeorm';
import { Category } from './Category';
import { Ingredient } from './Ingredient';
import { ProductImage } from './ProductImage';

@Entity()
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({
        length: 100,
    })
    name: string;

    @Column('text')
    description: string;

    @Column('float')
    price: number;

    @Column()
    imageUrl: string;

    @Column()
    calories: string;

    @Column()
    preparationTime?: string;

    @Column({ default: false })
    featured: boolean; // productos destacado

    @Column()
    available: boolean; // disponibilidad
    // eager: cada vez q hagamos un select de nuestra entidad user, el automaticamente me trae detalle
    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    category: Category;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.product)
    ingredients: Ingredient[];

    @OneToMany(() => ProductImage, (productImage) => productImage.product)
    productImages: ProductImage[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
    updatedAt: Date;
    product: Category[];
}
