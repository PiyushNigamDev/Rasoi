import mongoose from "mongoose";

const recipeSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },

price:{
    type:Number,
    required:true
},
image:{
    type: String,
    required:true
},
category:{
    type: String,
    required:true,
    enum:["fastfood","breakfast","lunch","dinner","dessert","dietfood","drink"]
},
preparationTime:{
    type:String,
    required:true
},
isAvailable:{
type:Boolean,
default:true
},
createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",

}},
{
    timestamps:true
}
);
export default mongoose.model("Recipe",recipeSchema);