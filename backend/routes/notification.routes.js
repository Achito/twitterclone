import express from 'express';
import { getNotifications, deleteNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', getNotifications);
router.post('/', deleteNotification);

export default router;