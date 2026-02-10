import mongoose from "mongoose";
import { config } from "./app.config";

const connectDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(config.MONGO_URI);
        console.log(`Mongo Database connected successfully to ${connectionInstance.connection.host} `);
    } catch (error) {
        console.error("Mongo Database connection error: ", error);
        process.exit(1);
    }
}

export default connectDatabase;