import { Router } from 'express';
import {
    adminLogin,
    getUsers,
    getEmailUser,
    createUser,
    updateUser,
    // deleteUser,
} from '../controllers/user.controller';
import { verifyAdmin } from '../middlewares/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/users', getUsers);
router.post('/users/email/quote-request', getEmailUser);
router.post('/users', verifyAdmin, createUser);
router.put('/users/:id', verifyAdmin, updateUser);
router.post('/admin/login', adminLogin);

export default router;
