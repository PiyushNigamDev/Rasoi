import User from "../models/User.js";
import jwt from "jsonwebtoken";

const jwtTokenGenerater=(userExists)=>{
    return jwt.sign({...userExists}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
}

export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        if (!name || !email || !password){

            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });

        }
        const userExists=await User.findOne({email});
        if(userExists){
         return   res.status(400).json({
                success:false,
                message:"user already exists"
            })
        }

       

        const newUser= await User.create({
             name,
            email,
            password
           
        });
        // await newUser.save();
            return res.status(201).json({
                success:true,
                message:"user registered successfully",
                data:newUser
            })
        

    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}


export const loginUser=async(req,res)=>{
     try{
        const {email, password}=req.body;
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

        }

        const userExists=await User.findOne({email}).select("+password");
        if(!userExists){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }
        const isMatch=await userExists.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"invalid password or email"
            })
        }else{
            const token=jwtTokenGenerater({
                id:userExists.id,
                name:userExists.name,
email:userExists.Email,
role:userExists.role

            })
            return res.status(200).json({
                success:true,
                message:"user logged in successfully",
                token:token
            })
        }

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}
