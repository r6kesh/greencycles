import Order from '../models/Order.js';

// @desc    Get assigned pickups for logged in agent
// @route   GET /api/agents/assigned-pickups
// @access  Private/Agent
export const getAssignedPickups = async (req, res) => {
    try {
        const orders = await Order.find({ agent: req.user._id, status: { $ne: 'Completed' } })
            .populate('customer', 'name phoneNumber')
            .populate('items.scrapType', 'name buyingPrice sellingPrice icon')
            .sort({ pickupDate: 1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get agent earnings summary
// @route   GET /api/agents/earnings
// @access  Private/Agent
export const getAgentEarnings = async (req, res) => {
    try {
        // Find completed pickups for this agent
        const completedOrders = await Order.find({ agent: req.user._id, status: 'Completed' });

        const totalEarnedForPlatform = completedOrders.reduce((acc, order) => acc + (order.totalFinalAmount || 0), 0);
        // Simplistic daily earnings logic (can expand this)
        const totalPickups = completedOrders.length;

        res.json({
            totalPickups,
            totalProcessedValue: totalEarnedForPlatform
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
