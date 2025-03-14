import { Request, Response } from 'express';
import { Category } from '../../entity/Category';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Category.find();
        return res.json(categories);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
export const getCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await Category.findOneBy({ id: id });

        if (!category)
            return res.status(404).json({ message: 'Category not found' });

        return res.json(category);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const existingCategory = await Category.findOneBy({ name: name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = new Category();
        category.name = name;
        await category.save();
        return res.json(category);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const category = await Category.findOneBy({ id: id });
        if (!category)
            return res.status(404).json({ message: 'Not category found' });

        await Category.update({ id: id }, req.body);
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await Category.delete({ id: id });
        if (result.affected === 0)
            return res.status(404).json({ message: 'Category not found' });
        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
