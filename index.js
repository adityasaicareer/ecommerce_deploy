import express from "express";

import Upload from "./routes/uploadproduct.js";
import Getproduct from "./routes/getproducts.js";
import Payments from "./routes/payments.js";

import cors from 'cors'
import { GetResourcePolicyCommand } from "@aws-sdk/client-dynamodb";

const app=express();
app.use(express.json());
app.use(cors());
app.use("/upload",Upload);
app.use("/getdb",Getproduct);
app.use("/payment",Payments);

app.listen(3002,(req,res)=>{
    console.log("Server started")
})