import { Request, Response } from 'express';
import { User } from '../entity/User';
import { genSalt, hash, compare } from 'bcryptjs';

interface UserBodyCreate {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone: string;
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        const { firstname, lastname, phone, address, email } = users[0];
        return res.json({ firstname, lastname, phone, address, email });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const getEmailUser = async (req: Request, res: Response) => {
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
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const createUser = async (
    req: Request<{}, {}, UserBodyCreate>,
    res: Response,
) => {
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
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findOneBy({ id: parseInt(id) });
        if (!user) return res.status(404).json({ message: 'Not user found' });

        await User.update({ id: parseInt(id) }, req.body);

        return res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const adminLogin = async (req: Request, res: Response) => {
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

        return res.json(user);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};
