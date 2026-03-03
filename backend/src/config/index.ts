import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  wsPort: parseInt(process.env.WS_PORT || '3002', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmodent',
  },
  jwt: {
    // CRITICAL: Change this in production!
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    // Short-lived access token (15 minutes for production, 7 days for dev)
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    // Long-lived refresh token (30 days)
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  cors: {
    // Comma-separated list of allowed origins
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
    path: process.env.UPLOAD_PATH || './uploads',
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};
