import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB= async()=>{
    try{
        const connection= await mongoose.connect(process.env.MONGO_DB_URL);
console.log("MongoDB Successfully connected");

    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}
export default connectDB;