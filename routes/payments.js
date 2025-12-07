// routes/checkout.js
import { Router } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

// Make sure your main app uses: app.use(express.json())

router.post("/", async (req, res) => {
  try {
    let { quantity = 1, price, productname = "Item" } = req.body;

    // Validate / normalize
    quantity = parseInt(quantity, 10);
    price = Number(price); // expected in dollars, e.g. 19.99

    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: productname },
            unit_amount: Math.round(price * 100), // cents, integer
          },
          quantity,
        },
      ],
      success_url: "http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/dashboard",
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;