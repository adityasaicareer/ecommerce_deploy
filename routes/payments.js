import {Router} from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

const router=Router();
router.post("/",async (req,res)=>{
    try{
        const {quantity,price,productname}=req.body;
        const session=await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            line_items:[{
                price_data:{
                    currency:"usd",
                    product_data:{name:productname},
                    unit_amount:price*100
                },
                quantity,
            }],
            success_url:'http://localhost:3000/dashboard',
            cancel_url:'http://localhost:3000/dashboard'
        })
        res.json({url:session.url})
    }
    catch(err)
    {
        console.log(err);
        res.json({error:err})
    }
})

export default router;