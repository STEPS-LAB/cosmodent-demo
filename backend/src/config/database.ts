import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from './logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    let uri = config.mongodb.uri;
    
    // Force IPv4 only if using localhost
    if (uri.includes('localhost')) {
      uri = uri.replace('localhost', '127.0.0.1');
    }
    
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB Connection Error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB Disconnected');
    });
    
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB Connection Closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Database Connection Failed: ${(error as Error).message}`);
    process.exit(1);
  }
};
