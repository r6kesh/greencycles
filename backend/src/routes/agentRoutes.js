import express from 'express';
import { getAssignedPickups, getAgentEarnings } from '../controllers/agentController.js';
import { protect, agent } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/assigned-pickups', protect, agent, getAssignedPickups);
router.get('/earnings', protect, agent, getAgentEarnings);

export default router;
