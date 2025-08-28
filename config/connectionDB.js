import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.CONN_STR) {
    throw new Error("Connection Failed");
}

async function connectDB() {
    try {
        await mongoose.connect(process.env.CONN_STR);
        console.log("✅ Database Connected");
    } catch (error) {
        console.log("❌ Database not Connected", error);
    }
}

export default connectDB;
