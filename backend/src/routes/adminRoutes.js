import express from 'express';
import { getAllOrders, updateOrderStatus, getAdminStats, getUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id').put(protect, admin, updateOrderStatus);
router.route('/stats').get(protect, admin, getAdminStats);
router.route('/users').get(protect, admin, getUsers);

export default router;
