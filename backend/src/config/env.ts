function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env variable: ${key}`);
  return value;
}

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: required("MONGO_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  SENDGRID_API_KEY: required("SENDGRID_API_KEY"),
  BASE_URL: required("BASE_URL"),
  FRONTEND_URL: required("FRONTEND_URL"),
};
