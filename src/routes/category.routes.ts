import { Router } from 'express';
import {
    getCategory,
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
} from '../controllers/category/category.controller';

const router = Router({ mergeParams: true });

router.get('/categories', getCategories);

router.get('/categories/:id', getCategory);

router.post('/categories', createCategory);

router.put('/categories/:id', updateCategory);

router.delete('/categories/:id', deleteCategory);

export default router;
