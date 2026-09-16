import mongoose from "mongoose";
const AdminSchema= new mongoose.Schema({
   
    email:{
    type: String,
    required: true,
    lowercase: true,
    },
    password:{
        type: String,
        required: true
    }
})
export default mongoose.model("Admin",AdminSchema);