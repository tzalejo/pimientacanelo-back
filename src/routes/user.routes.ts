import { Router } from 'express';
import {
    // getUsers,
    // getUser,
    createUser,
    updateUser,
    // deleteUser,
} from '../controllers/user.controller';

const router = Router({ mergeParams: true });

router.post('/users', createUser);
router.put('/users/:id', updateUser);

export default router;
