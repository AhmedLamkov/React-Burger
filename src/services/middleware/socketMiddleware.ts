import type { AppDispatch, RootState } from '../store';
import type { IWsMessage } from '../ws/types';
import type { TWsActions } from './types';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

type TWsAction = {
  type: string;
  payload?: string;
};

const sockets = new Map<string, WebSocket>();
const connectionAttempts = new Map<string, number>();

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
        const relativeUrl = action.payload ?? '';
        const fullUrl = wsUrl + relativeUrl;
        const connectionKey = fullUrl;

        const existingSocket = sockets.get(connectionKey);

        if (existingSocket) {
          const readyState = existingSocket.readyState;
          if (readyState === 0 || readyState === 1) {
            return next(action);
          }
          if (readyState === 2 || readyState === 3) {
            try {
              existingSocket.close(1000, 'Replaced');
            } catch (_error) {
              // пустой блок
            }
            sockets.delete(connectionKey);
          }
        }

        const attempts = connectionAttempts.get(connectionKey) ?? 0;
        connectionAttempts.set(connectionKey, attempts + 1);

        if (attempts > 3) {
          setTimeout(() => {
            connectionAttempts.delete(connectionKey);
            dispatch({ type: wsInit, payload: relativeUrl });
          }, 2000);
          return next(action);
        }

        try {
          const socket = new WebSocket(fullUrl);
          sockets.set(connectionKey, socket);
          dispatch({ type: wsConnecting });

          socket.onopen = (event) => {
            connectionAttempts.delete(connectionKey);
            dispatch({ type: onOpen, payload: event });
          };

          socket.onerror = (event) => {
            dispatch({ type: onError, payload: event });
          };

          socket.onmessage = (event: MessageEvent) => {
            try {
              const data = event.data as string;
              const parsedData = JSON.parse(data) as IWsMessage;
              if (parsedData.success === false) {
                const errorMessage = parsedData.message ?? 'WebSocket error';
                dispatch({ type: onError, payload: errorMessage });
              } else {
                dispatch({ type: onMessage, payload: parsedData });
              }
            } catch (_error) {
              dispatch({ type: onError, payload: 'Failed to parse message' });
            }
          };

          socket.onclose = (event) => {
            dispatch({ type: onClose, payload: event });
            sockets.delete(connectionKey);

            if (event.code !== 1000) {
              setTimeout(() => {
                dispatch({ type: wsInit, payload: relativeUrl });
              }, 3000);
            }
          };
        } catch (_error) {
          dispatch({ type: onError, payload: 'Failed to create WebSocket connection' });
        }
      }

      if (action.type === wsSendMessage) {
        // Можно оставить пустым или удалить
      }

      if (action.type === wsDisconnect) {
        const relativeUrl = action.payload;
        if (!relativeUrl) {
          return next(action);
        }
        const fullUrl = wsUrl + relativeUrl;
        const connectionKey = fullUrl;

        const socket = sockets.get(connectionKey);
        if (socket) {
          try {
            socket.close(1000, 'Disconnected by user');
          } catch (_error) {
            // пустой блок
          }
          sockets.delete(connectionKey);
        }
        connectionAttempts.delete(connectionKey);
      }

      return next(action);
    };
  }) as Middleware;
};
