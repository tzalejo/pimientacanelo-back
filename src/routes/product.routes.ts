import { Router } from 'express';
import {
    getProduct,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controllers/product/product.controller';

const router = Router({ mergeParams: true });

router.get('/product', getProducts);

router.get('/product/:id', getProduct);

router.post('/product', createProduct);

router.put('/product/:id', updateProduct);

router.delete('/product/:id', deleteProduct);

export default router;
