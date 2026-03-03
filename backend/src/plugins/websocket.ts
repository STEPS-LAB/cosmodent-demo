import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { WebSocket } from 'ws';

export type WsEventType =
  | 'appointment:created'
  | 'appointment:updated'
  | 'appointment:cancelled'
  | 'slots:updated'
  | 'ping';

export interface WsMessage<T = unknown> {
  event: WsEventType;
  payload: T;
  timestamp: string;
}

/**
 * WebSocket Event Hub
 *
 * Provides a lightweight pub/sub broadcast mechanism.
 * All connected admin clients receive real-time updates.
 *
 * Usage from any route/service:
 *   fastify.wsBroadcast('appointment:created', { ... })
 */
export const websocketPlugin = fp(async (fastify: FastifyInstance) => {
  const clients = new Set<WebSocket>();

  // ── Broadcast to all connected clients ──────────────────
  function broadcast<T>(event: WsEventType, payload: T): void {
    const message = JSON.stringify({
      event,
      payload,
      timestamp: new Date().toISOString(),
    } satisfies WsMessage<T>);

    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }

  fastify.decorate('wsBroadcast', broadcast);

  // ── WebSocket route ──────────────────────────────────────
  fastify.get('/ws', { websocket: true }, (ws: WebSocket) => {
    clients.add(ws);
    fastify.log.info(`WebSocket client connected (total: ${clients.size})`);

    // Heartbeat ping every 30s
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'ping', payload: null, timestamp: new Date().toISOString() }));
      }
    }, 30_000);

    ws.on('close', () => {
      clearInterval(pingInterval);
      clients.delete(ws);
      fastify.log.info(`WebSocket client disconnected (total: ${clients.size})`);
    });

    ws.on('error', (err: Error) => {
      fastify.log.error({ err }, 'WebSocket error');
      clients.delete(ws);
    });
  });
});

// Extend Fastify types
declare module 'fastify' {
  interface FastifyInstance {
    wsBroadcast: <T>(event: WsEventType, payload: T) => void;
  }
}
