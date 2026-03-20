import { Request, Response } from 'express';
import { Product } from '../../entity/Product';
import { Category } from '../../entity/Category';
import { ProductImage } from '../../entity/ProductImage';
import cloudinary from '../../config';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { featured } = req.params;

        if (featured) {
            const products = await Product.find({ where: { featured: true } });
            return res.json(products);
        }
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const product = await Product.findOneBy({ id: id });

        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        return res.json(product);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await Product.findOne({
            where: { id },
            relations: ['productImages'],
        });

        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        // Delete all images from Cloudinary before removing the product
        if (product.productImages && product.productImages.length > 0) {
            await Promise.all(
                product.productImages.map((img) =>
                    cloudinary.uploader.destroy(img.fileName),
                ),
            );
        }

        await Product.delete({ id });
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No product data provided' });
        }

        const { name, description, price, preparationTime, available } = req.body;

        // Category can arrive as a JSON string (multipart) or object (JSON body)
        const rawCategory = req.body.category;
        const category =
            typeof rawCategory === 'string' ? JSON.parse(rawCategory) : rawCategory;

        if (!name || !description || !price || !category || !preparationTime || available === undefined) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const getCategory = await Category.findOne({ where: { id: category.id } });
        if (!getCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        // Create product
        const product = new Product();
        Object.assign(product, {
            name,
            description,
            price: parseFloat(price),
            category: getCategory,
            preparationTime,
            available: available === 'true' || available === true,
        });
        await product.save();

        // Upload all images to Cloudinary
        for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.path);
            const productImage = new ProductImage();
            Object.assign(productImage, {
                product,
                fileName: uploadResult.public_id,
                fileMimiType: file.mimetype,
                fileExtension: uploadResult.format,
                fileSize: uploadResult.bytes,
                path: uploadResult.secure_url,
            });
            await productImage.save();
        }

        return res.status(201).json({
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findOneBy({ id });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        await Product.update({ id }, req.body);
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

// POST /products/:id/images — add images to an existing product (max 4 total)
export const addProductImages = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({
            where: { id },
            relations: ['productImages'],
        });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const currentCount = product.productImages?.length ?? 0;
        if (currentCount + files.length > 4) {
            return res.status(400).json({
                message: `Cannot add ${files.length} image(s). Product already has ${currentCount}. Maximum is 4.`,
            });
        }

        const newImages: ProductImage[] = [];
        for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.path);
            const productImage = new ProductImage();
            Object.assign(productImage, {
                product,
                fileName: uploadResult.public_id,
                fileMimiType: file.mimetype,
                fileExtension: uploadResult.format,
                fileSize: uploadResult.bytes,
                path: uploadResult.secure_url,
            });
            await productImage.save();
            newImages.push(productImage);
        }

        return res.status(201).json({
            message: 'Images added successfully',
            data: newImages,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

// DELETE /products/images/:imageId — remove a single image
export const deleteProductImage = async (req: Request, res: Response) => {
    const { imageId } = req.params;

    try {
        const image = await ProductImage.findOneBy({ id: parseInt(imageId) });
        if (!image)
            return res.status(404).json({ message: 'Image not found' });

        await cloudinary.uploader.destroy(image.fileName);
        await image.remove();

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
