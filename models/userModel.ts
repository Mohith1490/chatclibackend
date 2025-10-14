import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    email:String,
    hashedPassword:String,
    isVerified:{
        type:Boolean,
        default:false
    },
})

export const UserModel = mongoose.model("UserModel",userSchema)