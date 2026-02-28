import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            lat: Number,
            lng: Number,
        },
        status: {
            type: String,
            enum: ['Pending', 'Assigned', 'On the way', 'Completed', 'Cancelled'],
            default: 'Pending',
        },
        items: [
            {
                scrapType: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'ScrapItem',
                },
                estimatedWeight: Number, // In Kg
                actualWeight: Number,    // Filled by agent
                priceApplied: Number,    // Snapshot of buyingPrice per Kg
                sellingPriceApplied: Number, // Snapshot of sellingPrice per Kg for profit tracking
            }
        ],
        totalEstimatedAmount: Number,
        totalFinalAmount: Number,
        profitMargin: Number, // (sellingPriceApplied - priceApplied) * actualWeight
        pickupDate: {
            type: Date,
            required: true,
        },
        pickupTimeSlot: {
            type: String, // e.g. "10:00 AM - 12:00 PM"
        },
        proofImageUrl: {
            type: String, // Uploaded by agent
        },
        razorpayOrderId: {
            type: String,
        },
        razorpayPaymentId: {
            type: String,
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Pending',
        }
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
