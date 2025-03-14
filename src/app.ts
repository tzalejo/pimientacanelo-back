import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', categoryRoutes);

export default app;
