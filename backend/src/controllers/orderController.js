import Order from '../models/Order.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Setup Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

// @desc    Create new pickup order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, address, pickupDate, pickupTimeSlot, totalEstimatedAmount } = req.body;

        if (items && items.length === 0) {
            res.status(400);
            throw new Error('No scrap items selected');
        } else {
            const order = new Order({
                customer: req.user._id,
                items,
                address,
                pickupDate,
                pickupTimeSlot,
                totalEstimatedAmount,
            });

            // Update User address logic (optional: append if new)
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { addresses: address }
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders for the logged-in customer
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id })
            .populate('agent', 'name phoneNumber')
            .populate('items.scrapType', 'name buyingPrice sellingPrice icon')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name phoneNumber')
            .populate('agent', 'name phoneNumber')
            .populate('items.scrapType', 'name buyingPrice sellingPrice icon');

        if (order) {
            if (order.customer._id.toString() !== req.user._id.toString() && req.user.role === 'customer') {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign order to agent
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin
export const assignOrderToAgent = async (req, res) => {
    try {
        const { agentId } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.agent = agentId;
            order.status = 'Assigned';
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Agent updates order status
// @route   PUT /api/orders/:id/status
// @access  Private/Agent
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, items, proofImageUrl } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status || order.status;
            if (proofImageUrl) order.proofImageUrl = proofImageUrl;

            if (items && items.length > 0) {
                // Agent setting actual weights and locking in prices
                let calculatedFinalAmount = 0;
                let calculatedProfitMargin = 0;

                order.items = items.map(item => {
                    const lineAmount = item.actualWeight * item.priceApplied;
                    calculatedFinalAmount += lineAmount;
                    calculatedProfitMargin += (item.sellingPriceApplied - item.priceApplied) * item.actualWeight;
                    return item;
                });

                order.totalFinalAmount = calculatedFinalAmount;
                order.profitMargin = calculatedProfitMargin;
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Initiate Razorpay Payment for Order
// @route   POST /api/orders/:id/pay
// @access  Private/Agent
export const initiatePayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const amountInPaise = Math.round((order.totalFinalAmount || order.totalEstimatedAmount) * 100);

            if (process.env.RAZORPAY_KEY_ID) {
                const options = {
                    amount: amountInPaise,
                    currency: "INR",
                    receipt: `receipt_order_${order._id}`
                };

                const razorpayOrder = await razorpay.orders.create(options);
                order.razorpayOrderId = razorpayOrder.id;
            } else {
                // Mock Razorpay creation for dev
                order.razorpayOrderId = `mock_rzp_${Date.now()}`;
            }

            await order.save();
            res.json({ orderId: order.razorpayOrderId, amount: amountInPaise, key: process.env.RAZORPAY_KEY_ID });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/:id/verify-payment
// @access  Private/Agent/Customer
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_signature } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            if (process.env.RAZORPAY_KEY_SECRET) {
                const body = order.razorpayOrderId + "|" + razorpay_payment_id;
                const expectedSignature = crypto
                    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                    .update(body.toString())
                    .digest("hex");

                if (expectedSignature !== razorpay_signature) {
                    return res.status(400).json({ message: "Invalid Signature" });
                }
            }

            order.razorpayPaymentId = razorpay_payment_id || `mock_pay_${Date.now()}`;
            order.paymentStatus = 'Paid';
            order.status = 'Completed';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
