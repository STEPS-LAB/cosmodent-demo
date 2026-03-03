import { FastifyInstance, FastifyRequest } from 'fastify';
import { Server } from 'socket.io';

export const setupWebSocket = (io: Server) => {
  // Middleware for socket authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      // Allow connection for public events
      return next();
    }
    
    // Token verification would happen here with fastify.jwt
    next();
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join admin room for real-time notifications
    socket.on('admin:join', () => {
      socket.join('admin-room');
      console.log(`Admin joined: ${socket.id}`);
    });

    // Subscribe to appointment updates
    socket.on('appointments:subscribe', () => {
      socket.join('appointments');
      console.log(`Subscribed to appointments: ${socket.id}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

// Extend FastifyInstance type
declare module 'fastify' {
  interface FastifyInstance {
    io?: Server;
  }
}
