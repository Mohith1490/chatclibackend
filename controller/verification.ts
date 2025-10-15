import type { Request, Response } from "express";
import { UserModel } from "../models/userModel.ts";
import crypto from "crypto";
import { redisClient } from "../index.ts";
import sendMail from "../util/emailVerification.ts";

export async function signup(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        
        const existingUser = await UserModel.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "User already exists",
            });
        }

        const salt = process.env.HASH_SECRET!;
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 1000, 64, "sha512")
            .toString("hex");

        const otp = crypto.randomInt(100000, 999999).toString();
        await redisClient.set(email, otp, { EX: 300 });

        sendMail(email, otp);

        const newUser = new UserModel({
            email,
            hashedPassword,
            isVerified: false,
        });
        await newUser.save();

        return res.status(200).json({
            status: true,
            message: "User created. OTP sent to email.",
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
}

export async function verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const storedOTP = await redisClient.get(email);

    if (!storedOTP)
        return res.status(400).json({ status: false, message: "OTP expired or not found" });

    if (Number(storedOTP) !== Number(otp))
        return res.status(400).json({ status: false, message: "Invalid OTP" });

    await UserModel.updateOne({ email }, { isVerified: true });
    await redisClient.del(email);

    return res.status(200).json({ status: true, message: "Email verified successfully" });
}

export default async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const userData = await UserModel.findOne({ email }).exec();
    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (!userData.isVerified) {
      return res.status(403).json({
        status: false,
        message: "User is not verified. Please verify your email first.",
      });
    }

    const salt = process.env.HASH_SECRET!;
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (hashedPassword !== userData.hashedPassword) {
      return res.status(401).json({
        status: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}
