import express from 'express'
import { registerUser, authUser, allUsers } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// api/user/
router.route('/')
    .post(registerUser)
    .get(protect, allUsers)

// api/user/login
router.route('/login')
    .post(authUser)

export default router;