'use client';

import { useEffect, useState, useCallback } from 'react';

interface SSEMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export function useSSE(endpoint: string | null) {
  const [messages, setMessages] = useState<SSEMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<SSEMessage | null>(null);

  useEffect(() => {
    if (!endpoint) return;

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(endpoint);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          const msg: SSEMessage = {
            type: 'message',
            data: parsed,
            timestamp: Date.now(),
          };
          setMessages((prev) => [msg, ...prev]);
          setLastEvent(msg);
        } catch {
          // ignore non-json payload
        }
      };

      eventSource.addEventListener('stage_changed', (event: any) => {
        try {
          const parsed = JSON.parse(event.data);
          const msg: SSEMessage = {
            type: 'stage_changed',
            data: parsed,
            timestamp: Date.now(),
          };
          setMessages((prev) => [msg, ...prev]);
          setLastEvent(msg);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener('slot_update', (event: any) => {
        try {
          const parsed = JSON.parse(event.data);
          const msg: SSEMessage = {
            type: 'slot_update',
            data: parsed,
            timestamp: Date.now(),
          };
          setMessages((prev) => [msg, ...prev]);
          setLastEvent(msg);
        } catch {
          // ignore
        }
      });

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource?.close();
      };
    } catch {
      setIsConnected(false);
    }

    return () => {
      eventSource?.close();
    };
  }, [endpoint]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isConnected, lastEvent, clearMessages };
}
