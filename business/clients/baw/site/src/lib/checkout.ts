// Server-only checkout configuration. Checkout switches on when both Stripe
// values exist in the environment; until then every surface states, truthfully,
// that no payment can be taken. The Stripe Price object is the authoritative
// price once connected. The on-page figure below is the planned display price
// and must be confirmed with Cathal before keys go in.

export const plannedPriceLabel = "£20";

export const checkoutConfig = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_CHECKOUT_PRICE_ID;
  if (!secretKey || !priceId) return null;
  return { secretKey, priceId };
};

export const isCheckoutConfigured = () => checkoutConfig() !== null;
