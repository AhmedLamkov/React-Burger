import { wsActions } from '../ws/actions';

import type { AppDispatch, RootState } from '../store';
import type { IWsMessage } from '../ws/types';
import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';

type WsAction = {
  type: string;
  payload?: string;
};

export const socketMiddleware = (wsUrl: string): Middleware => {
  return ((store: MiddlewareAPI<AppDispatch, RootState>) => {
    let socket: WebSocket | null = null;
    let isConnected = false;
    let reconnectTimer = 0;
    let currentUrl = '';

    return (next) => (action: WsAction) => {
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
        currentUrl = action.payload ?? '';
        const fullUrl = `${wsUrl}${currentUrl}`;

        try {
          if (socket) {
            socket.close(1000, 'New connection');
          }

          socket = new WebSocket(fullUrl);
          isConnected = true;
          dispatch({ type: wsConnecting });
        } catch (error) {
          dispatch({ type: onError, payload: error });
        }
      }

      if (socket) {
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
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            dispatch({ type: onError, payload: 'Failed to parse message' });
          }
        };

        socket.onclose = (event) => {
          dispatch({ type: onClose, payload: event });

          if (isConnected && event.code !== 1000) {
            reconnectTimer = window.setTimeout(() => {
              dispatch({ type: wsInit, payload: currentUrl });
            }, 3000);
          }
        };

        if (action.type === wsSendMessage) {
          const message = action.payload;
          if (message) {
            socket.send(JSON.stringify(message));
          }
        }

        if (action.type === wsDisconnect) {
          isConnected = false;
          clearTimeout(reconnectTimer);
          if (socket) {
            socket.close(1000, 'Работа приложения закончена');
          }
        }
      }

      next(action);
    };
  }) as Middleware;
};
