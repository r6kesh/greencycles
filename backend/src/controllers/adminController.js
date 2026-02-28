import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc    Get all orders (with filtering)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('customer', 'name phoneNumber')
            .populate('agent', 'name phoneNumber')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status / Assign Agent
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, agentId } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            if (status) order.status = status;
            if (agentId) order.agent = agentId;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (customers and agents)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-otp');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all analytics stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'Completed' });
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });

        // Summing up total final amount and profit margin
        const revenuePipeline = await Order.aggregate([
            { $match: { status: 'Completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalFinalAmount" },
                    totalProfit: { $sum: "$profitMargin" }
                }
            }
        ]);

        const totalRevenue = revenuePipeline.length > 0 ? revenuePipeline[0].totalRevenue : 0;
        const totalProfit = revenuePipeline.length > 0 ? (revenuePipeline[0].totalProfit || 0) : 0;

        res.json({
            totalOrders,
            completedOrders,
            pendingOrders,
            totalRevenue,
            totalProfit
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
