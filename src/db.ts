import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Category } from './entity/Category';
import { Product } from './entity/Product';
import { Ingredient } from './entity/Ingredient';
import { ProductImage } from './entity/ProductImage';
import {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
} from './config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User, Category, Product, Ingredient, ProductImage],
});
