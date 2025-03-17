import { Request, Response } from 'express';
import { Ingredient } from '../../entity/Ingredient';

export const getIngredients = async (req: Request, res: Response) => {
    try {
        const ingredients = await Ingredient.find();
        return res.json(ingredients);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const getIngredient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ingredient = await Ingredient.findOneBy({ id: id });

        if (!ingredient)
            return res.status(404).json({ message: 'Ingredient not found' });

        return res.json(ingredient);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const createIngredient = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const ingredient = new Ingredient();
        ingredient.name = name;
        await ingredient.save();
        return res.json(ingredient);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
