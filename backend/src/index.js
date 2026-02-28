import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins for the MVP/Beta phase
  credentials: true
}));

// Basic route
app.get('/', (req, res) => {
  res.send('Scrap Pickup API is running');
});

// Import Routes
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
