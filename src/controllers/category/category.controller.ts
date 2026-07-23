import { NextFunction, Request, Response } from 'express';
import { Category } from '../../entity/Category';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        return res.json(categories);
    } catch (error) {
        next(error);
    }
};
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findOneBy({ id: id });

        if (!category)
            return res.status(404).json({ message: 'Category not found' });

        return res.json(category);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
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
        next(error);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const category = await Category.findOneBy({ id: id });
        if (!category)
            return res.status(404).json({ message: 'Not category found' });

        const { name } = req.body;
        const updateData: Record<string, unknown> = {};
        if (name !== undefined) updateData.name = name;

        await Category.update({ id }, updateData);
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await Category.delete({ id: id });
        if (result.affected === 0)
            return res.status(404).json({ message: 'Category not found' });
        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
