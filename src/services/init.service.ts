import { User } from '../entity/User';
import { genSalt, hash } from 'bcryptjs';
import {
    USERNAME as username,
    USERLASTNAME as userLastname,
    PASSWORD as password,
    EMAIL as email,
    PHONE as phone,
} from './../config';

export const createDefaultUser = async () => {
    const defaultEmail = email;
    const existingUser = await User.findOneBy({ email: defaultEmail });

    if (!existingUser) {
        const user = new User();
        user.firstname = username;
        user.lastname = userLastname;
        user.email = defaultEmail;
        user.phone = phone;

        const salt = await genSalt(10);
        user.password = await hash(password, salt); // 👈 Contraseña por defecto

        await user.save();
        console.log('✅ Usuario por defecto creado correctamente.');
    }
};
