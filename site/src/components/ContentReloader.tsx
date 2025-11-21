'use client';

import {useEffect} from 'react';

export function ContentReloader() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
      console.log('[ContentReloader] Connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reload') {
        console.log('[ContentReloader] Reloading...', data.file);
        window.location.reload();
      }
    };

    ws.onerror = (error) => {
      console.error('[ContentReloader] Error:', error);
    };

    return () => ws.close();
  }, []);

  return null;
}
