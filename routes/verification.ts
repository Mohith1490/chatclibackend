import express from "express"
import signin, { signup, verifyOTP } from "../controller/verification.ts"

const VerificationRoute = express.Router()

VerificationRoute.post("/signup",signup)
VerificationRoute.post("/otp-verifiy",verifyOTP)
VerificationRoute.post("/signin",signin)

export default VerificationRoute