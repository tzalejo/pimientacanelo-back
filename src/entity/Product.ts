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

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.product)
    ingredients: Ingredient[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
    updatedAt: Date;
    product: Category[];
}
