import { Request, Response } from 'express';
import { User } from '../entity/User';
import { genSalt, hash } from 'bcryptjs';

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

// export const getUser = async (
//     req: Request,
//     res: Response,
// ): Promise<Response> => {
//     try {
//         const { id } = req.params;
//         const user = await User.findOneBy({ id: parseInt(id) });
//
//         if (!user) return res.status(404).json({ message: 'User not found' });
//
//         return res.json(user);
//     } catch (error) {
//         if (error instanceof Error) {
//             return res.status(500).json({ message: error.message });
//         }
//     }
// };

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

// export const deleteUser = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         const result = await User.delete({ id: parseInt(id) });
//
//         if (result.affected === 0)
//             return res.status(404).json({ message: 'User not found' });
//
//         return res.sendStatus(204);
//     } catch (error) {
//         if (error instanceof Error) {
//             return res.status(500).json({ message: error.message });
//         }
//     }
// };
