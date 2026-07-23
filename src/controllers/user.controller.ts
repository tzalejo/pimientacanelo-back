import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/User';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

interface UserBodyCreate {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
}

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find();
        const { firstname, lastname, phone, address, email } = users[0];
        return res.json({ firstname, lastname, phone, address, email });
    } catch (error) {
        next(error);
    }
};

export const getEmailUser = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        // console.log(req.body);
        // body: {
        //     name: 'Alejandro Valenzuela',
        //     email: 'tzalejo@gmail.com',
        //     phone: '+542901642028',
        //     eventDate: '2025-04-30T03:00:00.000Z',
        //     guestCount: '100',
        //     cakeType: 'Torta presupuesto',
        //     message: 'kjñlkfjsañlkfdjñalsdkj akjdfñlakjdsñ laksjdfñlkajsdlkajñldskj ñalskdjf skdfj'
        //   }
        return res.json('Enviado Solicitud');
    } catch (error) {
        next(error);
    }
};

export const createUser = async (
    req: Request<{}, {}, UserBodyCreate>,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { firstname, lastname, email, password, phone } = req.body;
        const user = new User();
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.phone = phone;

        const salt = await genSalt();
        user.password = await hash(password, salt);

        await user.save();
        return res.json(user);
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === '23505') {
            return res.status(409).json({ message: 'Ya existe un usuario con ese email' });
        }
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const user = await User.findOneBy({ id: parseInt(id) });
        if (!user) return res.status(404).json({ message: 'Not user found' });

        const { firstname, lastname, email, phone, address } = req.body;
        const updateData: Record<string, unknown> = {};

        if (firstname !== undefined) updateData.firstname = firstname;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;

        await User.update({ id: parseInt(id) }, updateData);

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { firstname: username } });

        if (!user) {
            return res
                .status(404)
                .json({ message: 'El Usuario no existe con ese nombre' });
        }

        // campara los pass y devuelve un boolena
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Invalido la credenciales' });
        }

        const token = sign({ sub: user.id }, JWT_SECRET, { expiresIn: '8h' });
        const { firstname, lastname, phone, address, email } = user;
        return res.json({
            token,
            user: { firstname, lastname, phone, address, email },
        });
    } catch (error) {
        next(error);
    }
};
