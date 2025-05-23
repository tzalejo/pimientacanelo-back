import { Router } from 'express';
import {
    getProduct,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from '../controllers/product/product.controller';

import { uploadFile } from '../middlewares/uploadFiles.middleware';

const router = Router({ mergeParams: true });

router.get('/products', getProducts);

router.get('/products/featured', getProducts);

router.get('/products/:id', getProduct);

router.post('/products', uploadFile, createProduct);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);

export default router;
