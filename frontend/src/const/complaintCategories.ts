export const COMPLAINT_CATEGORIES = [
  {
    value: "POLICY_PAYMENTS",
    label: "Policy & Payments Issues",
    description: "Premiums, policy renewal, payment failures",
  },
  {
    value: "CLAIMS",
    label: "Insurance Claims",
    description: "Claim filing, claim status, settlement delays",
  },
  {
    value: "SUPPORT_APP",
    label: "App / Customer Support",
    description: "Login issues, app bugs, support requests",
  },
  {
    value: "OTHER",
    label: "Other Issues",
    description: "Any issue not listed above",
  },
] as const;
