import  express  from "express"
import dotenv from "dotenv"
import redis from "redis"
import cors from "cors"
import mongoose from "mongoose"
import VerificationRoute from "./routes/verification.ts";
dotenv.config()

const app = express();
export const redisClient = redis.createClient();
redisClient.connect().then(()=>{
    console.log("redis connected");
}).catch((error)=>{
    console.log("redis not connected",error);
})

app.use(cors())
app.use(express.json())
app.use("/auth",VerificationRoute)

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3000, () => console.log("Server started on port 3000"));
  })
  .catch((error) => {
    console.error("MongoDB connection error", error);
  });