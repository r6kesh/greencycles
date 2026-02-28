import express from 'express';
import { getScrapPrices, updateScrapPrice, createScrapItem } from '../controllers/priceController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getScrapPrices);
router.post('/', protect, admin, createScrapItem);
router.put('/:id', protect, admin, updateScrapPrice);

export default router;
