import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';

const app = express();

app.use(morgan('dev'));
app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    }),
);
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);

export default app;
