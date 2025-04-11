import { Request, Response } from 'express';
import { Product } from '../../entity/Product';
import { Category } from '../../entity/Category';
import { ProductImage } from '../../entity/ProductImage';
import cloudinary from '../../config';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { featured } = req.params;

        if (featured) {
            const products = await Product.find({
                where: { featured: true },
            });
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
        const result = await Product.delete({ id: id });

        if (result.affected === 0)
            return res.status(404).json({ message: 'Product not found' });

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        // Validación inicial
        if (!req.body.data) {
            return res
                .status(400)
                .json({ message: 'No product data provided' });
        }

        const { data } = req.body;
        const productData = JSON.parse(data);

        const {
            name,
            description,
            price,
            category,
            calories,
            preparationTime,
            available,
        } = productData;

        // Validación de campos requeridos
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !calories ||
            !preparationTime
        ) {
            return res
                .status(400)
                .json({ message: 'Please provide all required fields' });
        }

        const getCategory = await Category.findOne({
            where: { id: category.id },
        });
        if (!getCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Crear el producto
        const product = new Product();
        Object.assign(product, {
            name,
            description,
            price,
            category: getCategory,
            calories,
            preparationTime,
            available,
        });
        await product.save();

        // Verificar la existencia de imagen
        if (!req.file) {
            return res.status(400).json({ message: 'Image not found' });
        }

        // Subir la imagen
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        const productImage = new ProductImage();
        Object.assign(productImage, {
            product,
            fileName: uploadResult?.public_id,
            fileMimiType: uploadResult?.format,
            fileExtension: uploadResult?.format,
            fileSize: uploadResult?.bytes,
            path: uploadResult?.secure_url,
        });

        await productImage.save();

        return res.status(201).json({
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        console.log('Error en createProduct');
        console.log(error);
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
