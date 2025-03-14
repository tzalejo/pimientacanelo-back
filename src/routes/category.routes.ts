import { Router } from 'express';
import {
    getCategory,
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
} from '../controllers/category/category.controller';

const router = Router({ mergeParams: true });

router.get('/category', getCategories);

router.get('/category/:id', getCategory);

router.post('/category', createCategory);

router.put('/category/:id', updateCategory);

router.delete('/category/:id', deleteCategory);

export default router;
