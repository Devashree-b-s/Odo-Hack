const mongoose = require("mongoose");

async function connectDB() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not configured. Add it to backend/.env before connecting to MongoDB.");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
}

module.exports = connectDB;
