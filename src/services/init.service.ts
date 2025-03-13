import { User } from '../entity/User';
import { genSalt, hash } from 'bcryptjs';

export const createDefaultUser = async () => {
    const defaultEmail = process.env.EMAIL; // 👈 Correo por defecto
    const existingUser = await User.findOneBy({ email: defaultEmail });

    if (!existingUser) {
        const user = new User();
        user.firstname = process.env.USER || 'noelia';
        user.lastname = 'fernandez';
        user.email = defaultEmail || 'mWYiI@example.com';

        const salt = await genSalt(10);
        user.password = await hash(process.env.PASSWORD || '123456', salt); // 👈 Contraseña por defecto

        await user.save();
        console.log('✅ Usuario por defecto creado correctamente.');
    }
};
