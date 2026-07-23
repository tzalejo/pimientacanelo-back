import express, { NextFunction, Request, Response } from 'express';
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

app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        message: err instanceof Error ? err.message : 'Internal server error',
    });
});

export default app;
