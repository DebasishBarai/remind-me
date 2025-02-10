export const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_SANDBOX_PAYPAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
  components: ["buttons"],
  "enable-funding": ["paylater", "venmo"],
  "disable-funding": ["card", "credit"],
  "data-client-token": "abc123xyz==",
};

export const PLAN_PRICES = {
  basic: 19,
  premium: 29,
} as const; 