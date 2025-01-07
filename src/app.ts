import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // CORS middleware
import path from 'path';
import routes from './routes/index';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not defined");
}

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:8081',
        'http://app.greencoffeebeauty.com',
    ], // Allow multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Enable credentials (cookies, tokens)
    optionsSuccessStatus: 200 // For legacy browsers
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

// Routes
app.use('/api', routes);

// Test route
app.get('/', (req, res) => {
    res.send("Beauty Salon Management System backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
