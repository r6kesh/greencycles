import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    assignOrderToAgent,
    updateOrderStatus,
    initiatePayment,
    verifyPayment
} from '../controllers/orderController.js';
import { protect, agent, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createOrder);

router.route('/myorders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

// Admin Routes
router.route('/:id/assign').put(protect, admin, assignOrderToAgent);

// Agent Routes
router.route('/:id/status').put(protect, agent, updateOrderStatus);
router.route('/:id/pay').post(protect, agent, initiatePayment);
router.route('/:id/verify-payment').post(protect, agent, verifyPayment);

export default router;
