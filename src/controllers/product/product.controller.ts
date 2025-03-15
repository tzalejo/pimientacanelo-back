import { Request, Response } from 'express';
import { Product } from '../../entity/Product';
import { Category } from '../../entity/Category';

export const getProducts = async (req: Request, res: Response) => {
    try {
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
        const {
            name,
            description,
            price,
            categoryId,
            imageUrl,
            calories,
            preparationTime,
            available,
            ingredients,
        } = req.body;
        const category = await Category.findOne({
            where: { id: categoryId },
        });

        if (!category) {
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            const product = new Product();
            product.name = name;
            product.description = description;
            product.price = price;
            product.category = category;
            product.imageUrl = imageUrl;
            product.calories = calories;
            product.preparationTime = preparationTime;
            product.available = available;
            await product.save();

            // if (ingredients) {
            // const ingredientIds = ingredients.map((id: string) => ({ id }));
            // await product.ingredients.set(ingredientIds);
            // }

            return res.json(product);
        }
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
