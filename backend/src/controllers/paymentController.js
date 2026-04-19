import Stripe from "stripe";

const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

export async function createStripeCheckoutSession(req, res) {
  if (!process.env.STRIPE_SECRET_KEY) {
    res.status(400);
    throw new Error("Stripe is not configured. Add STRIPE_SECRET_KEY.");
  }

  const { items, metadata = {} } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items provided for payment.");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "try",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(Number(item.price) * 100),
    },
    quantity: Number(item.quantity),
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${frontendURL}/checkout?payment=success`,
    cancel_url: `${frontendURL}/checkout?payment=cancelled`,
    metadata,
  });

  res.status(200).json({ url: session.url, id: session.id });
}
