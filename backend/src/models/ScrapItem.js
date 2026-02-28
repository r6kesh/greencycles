import mongoose from 'mongoose';

const scrapItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        buyingPrice: {
            type: Number,
            required: true,
            description: "Price per Kg paid to customer"
        },
        sellingPrice: {
            type: Number,
            required: true,
            description: "Price per Kg sold to factory/recycler"
        },
        icon: {
            type: String, // URL to image/icon
        }
    },
    {
        timestamps: true,
    }
);

const ScrapItem = mongoose.model('ScrapItem', scrapItemSchema);

export default ScrapItem;
