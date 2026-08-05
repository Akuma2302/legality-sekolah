import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || '*',
  username: process.enc.DEFAULT_USERNAME,
  password: process.enc.DEFAULT_PASSWORD,
};
