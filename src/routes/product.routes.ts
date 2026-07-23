import { Router } from 'express';
import {
    getProduct,
    getProducts,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    updateProduct,
    addProductImages,
    deleteProductImage,
} from '../controllers/product/product.controller';

import { uploadFiles, uploadFilesOptional } from '../middlewares/uploadFiles.middleware';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/products', getProducts);
router.get('/products/featured', getFeaturedProducts);
router.get('/products/:id', getProduct);

router.post('/products', verifyAdmin, uploadFiles, createProduct);
router.put('/products/:id', verifyAdmin, updateProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);

// Image management
router.post('/products/:id/images', verifyAdmin, uploadFilesOptional, addProductImages);
router.delete('/products/images/:imageId', verifyAdmin, deleteProductImage);

export default router;
