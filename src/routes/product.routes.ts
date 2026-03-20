import { Router } from 'express';
import {
    getProduct,
    getProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    addProductImages,
    deleteProductImage,
} from '../controllers/product/product.controller';

import { uploadFiles, uploadFilesOptional } from '../middlewares/uploadFiles.middleware';

const router = Router({ mergeParams: true });

router.get('/products', getProducts);
router.get('/products/featured', getProducts);
router.get('/products/:id', getProduct);

router.post('/products', uploadFiles, createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Image management
router.post('/products/:id/images', uploadFilesOptional, addProductImages);
router.delete('/products/images/:imageId', deleteProductImage);

export default router;
