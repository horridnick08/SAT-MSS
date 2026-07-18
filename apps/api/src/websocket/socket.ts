import type { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger.js';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'default_secret';

let io: Server | null = null;

// Map to track user connections: userId -> Set of socketIds
const userConnections = new Map<string, Set<string>>();

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function initializeSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
  });

  // JWT auth handshake middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth['token'] || socket.handshake.query['token'];

    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication token is required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        sub: string;
        email: string;
        role: string;
      };

      socket.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (err) {
      logger.error('WebSocket connection authentication failed', { error: err });
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user!.id;
    logger.info('WebSocket client connected', {
      socketId: socket.id,
      userId,
      role: socket.user!.role,
    });

    // Track active connection
    if (!userConnections.has(userId)) {
      userConnections.set(userId, new Set());
    }
    userConnections.get(userId)!.add(socket.id);

    // Join a room based on the user's role
    void socket.join(`role:${socket.user!.role}`);
    // Join private room for direct messages
    void socket.join(`user:${userId}`);

    socket.on('disconnect', () => {
      logger.info('WebSocket client disconnected', { socketId: socket.id, userId });
      const connections = userConnections.get(userId);
      if (connections) {
        connections.delete(socket.id);
        if (connections.size === 0) {
          userConnections.delete(userId);
        }
      }
    });
  });

  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.IO is not initialized yet.');
  }
  return io;
}

/** Emit event to a specific user */
export function emitToUser(userId: string, eventName: string, payload: unknown): void {
  if (io && userConnections.has(userId)) {
    io.to(`user:${userId}`).emit(eventName, payload);
    logger.debug('Sent direct WS event', { userId, eventName });
  }
}

/** Emit event to all members of a role group */
export function emitToRole(role: string, eventName: string, payload: unknown): void {
  if (io) {
    io.to(`role:${role}`).emit(eventName, payload);
    logger.debug('Sent role-scoped WS event', { role, eventName });
  }
}

/** Broadcast event to all authenticated connections */
export function broadcast(eventName: string, payload: unknown): void {
  if (io) {
    io.emit(eventName, payload);
    logger.debug('Broadcasted WS event', { eventName });
  }
}
