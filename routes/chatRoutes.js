import express from 'express'
import { accessChat, createGroupChat, fetchChats, renameGroup, addToGroup, removeFromGroup } from '../controllers/chatControllers.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router()

// api/chat/
router.route('/')
    .get(protect, fetchChats)
    .post(protect, accessChat)

// api/chat/group
router.route('/group')
    .post(protect, createGroupChat);

// api/chat/rename
router.route('/rename')
    .patch(protect, renameGroup);

// api/chat/groupremove
router.route('/groupremove')
    .patch(protect, removeFromGroup);

// api/chat/groupadd
router.route('/groupadd')
    .patch(protect, addToGroup);

export default router;