import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import { FastifyInstance } from 'fastify';

/**
 * Database Plugin
 * Manages the MongoDB connection lifecycle with Fastify.
 * Uses fastify-plugin so the decorator is available globally.
 */
export const databasePlugin = fp(async (fastify: FastifyInstance) => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment');

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  fastify.log.info('✅ MongoDB connected');

  // Gracefully close connection when Fastify shuts down
  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
    fastify.log.info('🔌 MongoDB disconnected');
  });

  // Expose mongoose instance via Fastify decorator
  fastify.decorate('mongoose', mongoose);
});

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose;
  }
}
