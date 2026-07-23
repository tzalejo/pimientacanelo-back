import { Router } from 'express';
import {
    getCategory,
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
} from '../controllers/category/category.controller';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/categories', getCategories);

router.get('/categories/:id', getCategory);

router.post('/categories', verifyAdmin, createCategory);

router.put('/categories/:id', verifyAdmin, updateCategory);

router.delete('/categories/:id', verifyAdmin, deleteCategory);

export default router;
