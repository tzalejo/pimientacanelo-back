import { Router } from 'express';
import {
    getProduct,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controllers/product/product.controller';

const router = Router({ mergeParams: true });

router.get('/products', getProducts);

router.get('/products/:featured', getProducts);

router.get('/products/:id', getProduct);

router.post('/products', createProduct);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

export default router;
