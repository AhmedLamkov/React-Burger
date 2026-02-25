import type { AppDispatch, RootState } from '../store';
import type { IWsMessage } from '../ws/types';
import type { TWsActions } from './types';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

type TWsAction = {
  type: string;
  payload?: string;
};

const sockets = new Map<string, WebSocket>();
const connections = new Map<string, boolean>();
const timers = new Map<string, number>();

export const socketMiddleware = (wsUrl: string, wsActions: TWsActions): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    return (next) => (action: TWsAction) => {
      const { dispatch } = store;

      const {
        wsInit,
        wsSendMessage,
        onOpen,
        onClose,
        onError,
        onMessage,
        wsConnecting,
        wsDisconnect,
      } = wsActions;

      if (action.type === wsInit) {
        const url = action.payload ?? '';
        const fullUrl = `${wsUrl}${url}`;

        const connectionKey = url.includes('?token') ? 'private' : 'public';

        if (
          sockets.has(connectionKey) &&
          sockets.get(connectionKey)?.readyState === WebSocket.OPEN
        ) {
          return next(action);
        }

        try {
          if (sockets.has(connectionKey)) {
            sockets.get(connectionKey)?.close(1000, 'New connection');
          }

          const socket = new WebSocket(fullUrl);
          sockets.set(connectionKey, socket);
          connections.set(connectionKey, true);
          dispatch({ type: wsConnecting });

          socket.onopen = (event) => {
            dispatch({ type: onOpen, payload: event });
          };

          socket.onerror = (event) => {
            dispatch({ type: onError, payload: event });
          };

          socket.onmessage = (event: MessageEvent) => {
            try {
              const data: string = event.data as string;
              const parsedData: IWsMessage = JSON.parse(data) as IWsMessage;

              if (parsedData.success === false) {
                const errorMessage: string = parsedData.message ?? 'WebSocket error';
                dispatch({ type: onError, payload: errorMessage });
              } else {
                dispatch({ type: onMessage, payload: parsedData });
              }
            } catch {
              dispatch({ type: onError, payload: 'Failed to parse message' });
            }
          };

          socket.onclose = (event) => {
            dispatch({ type: onClose, payload: event });

            const isConnected = connections.get(connectionKey) ?? false;
            if (isConnected && event.code !== 1000) {
              const timer = window.setTimeout(() => {
                dispatch({ type: wsInit, payload: url });
              }, 3000);
              timers.set(connectionKey, timer);
            }
          };
        } catch {
          dispatch({ type: onError, payload: 'Failed to create WebSocket connection' });
        }
      }

      if (action.type === wsSendMessage) {
        const url = action.payload ?? '';
        const connectionKey = url.includes('?token') ? 'private' : 'public';
        const socket = sockets.get(connectionKey);

        if (socket && socket.readyState === WebSocket.OPEN) {
          const message = action.payload;
          socket.send(JSON.stringify(message));
        }
      }

      if (action.type === wsDisconnect) {
        const url = action.payload ?? '';
        const connectionKey = url.includes('?token') ? 'private' : 'public';

        connections.set(connectionKey, false);

        const timer = timers.get(connectionKey);
        if (timer) {
          clearTimeout(timer);
          timers.delete(connectionKey);
        }

        const socket = sockets.get(connectionKey);
        if (socket) {
          socket.close(1000, 'Работа приложения закончена');
          sockets.delete(connectionKey);
        }
      }

      next(action);
    };
  }) as Middleware;
};
