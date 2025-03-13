import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Category } from './entity/Category';
import { Product } from './entity/Product';
import { Ingredient } from './entity/Ingredient';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5444,
    username: 'postgres',
    password: 'postgres',
    database: 'pimientacanelo',
    synchronize: true,
    logging: true,
    entities: [User, Category, Product, Ingredient],
});
