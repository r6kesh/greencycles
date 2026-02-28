import ScrapItem from '../models/ScrapItem.js';

// @desc    Get all scrap prices
// @route   GET /api/prices
// @access  Public or Customer/Agent/Admin
export const getScrapPrices = async (req, res) => {
    try {
        const prices = await ScrapItem.find({});
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a scrap price (Admin only)
// @route   PUT /api/prices/:id
// @access  Admin
export const updateScrapPrice = async (req, res) => {
    const { buyingPrice, sellingPrice, name, icon } = req.body;

    try {
        const item = await ScrapItem.findById(req.params.id);

        if (item) {
            item.buyingPrice = buyingPrice !== undefined ? buyingPrice : item.buyingPrice;
            item.sellingPrice = sellingPrice !== undefined ? sellingPrice : item.sellingPrice;
            item.name = name || item.name;
            item.icon = icon || item.icon;

            const updatedItem = await item.save();
            res.status(200).json(updatedItem);
        } else {
            res.status(404).json({ message: 'Scrap item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new scrap item (Admin only)
// @route   POST /api/prices
// @access  Admin
export const createScrapItem = async (req, res) => {
    const { name, buyingPrice, sellingPrice, icon } = req.body;

    try {
        const item = new ScrapItem({
            name,
            buyingPrice,
            sellingPrice,
            icon
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
