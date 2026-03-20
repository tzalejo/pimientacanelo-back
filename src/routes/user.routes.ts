import { Router } from 'express';
import {
    adminLogin,
    getUsers,
    getEmailUser,
    createUser,
    updateUser,
    // deleteUser,
} from '../controllers/user.controller';

const router = Router({ mergeParams: true });

router.get('/users', getUsers);
router.post('/users/email/quote-request', getEmailUser);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.post('/admin/login', adminLogin);

export default router;
