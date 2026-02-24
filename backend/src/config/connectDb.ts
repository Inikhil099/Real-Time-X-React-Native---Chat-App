import mongoose from "mongoose";

export async function ConnectDb() {
    try {
        return await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.log("db connection failed")
        process.exit(1)
    }
}