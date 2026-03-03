'use client';

import { useEffect, useRef, useCallback } from 'react';

export type WsEventType =
  | 'appointment:created'
  | 'appointment:updated'
  | 'appointment:cancelled'
  | 'slots:updated'
  | 'ping';

export interface WsMessage<T = unknown> {
  event:     WsEventType;
  payload:   T;
  timestamp: string;
}

type WsHandler<T = unknown> = (message: WsMessage<T>) => void;

/**
 * useWebSocket
 *
 * Connects to the Cosmodent backend WebSocket.
 * Auto-reconnects on disconnect with exponential backoff.
 * Used by admin panel for real-time appointment notifications.
 */
export function useWebSocket(handlers: Partial<Record<WsEventType, WsHandler>>) {
  const wsRef       = useRef<WebSocket | null>(null);
  const retryRef    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const retryDelay  = useRef(1000);
  const handlersRef = useRef(handlers);

  // Keep handlers ref up to date without re-connecting
  handlersRef.current = handlers;

  const connect = useCallback(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:3001';
    const ws  = new WebSocket(`${url}/ws`);

    ws.onopen = () => {
      retryDelay.current = 1000; // reset backoff
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string) as WsMessage;
        const handler = handlersRef.current[msg.event];
        if (handler) handler(msg as WsMessage<any>);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      // Exponential backoff reconnect
      retryRef.current = setTimeout(() => {
        retryDelay.current = Math.min(retryDelay.current * 2, 30_000);
        connect();
      }, retryDelay.current);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(retryRef.current);
      wsRef.current?.close();
    };
  }, [connect]);
}
