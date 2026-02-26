import { createAction } from '@reduxjs/toolkit';

import type { IWsMessage } from './types';

export const WS_CONNECTION_START = 'WS_CONNECTION_START';
export const WS_CONNECTION_SUCCESS = 'WS_CONNECTION_SUCCESS';
export const WS_CONNECTION_ERROR = 'WS_CONNECTION_ERROR';
export const WS_CONNECTION_CLOSED = 'WS_CONNECTION_CLOSED';
export const WS_GET_MESSAGE = 'WS_GET_MESSAGE';
export const WS_SEND_MESSAGE = 'WS_SEND_MESSAGE';
export const WS_CONNECTING = 'WS_CONNECTING';
export const WS_DISCONNECT = 'WS_DISCONNECT';

export const wsConnectionStart = createAction<string>(WS_CONNECTION_START);
export const wsConnectionSuccess = createAction(WS_CONNECTION_SUCCESS);
export const wsConnectionError = createAction<string | Event>(WS_CONNECTION_ERROR);
export const wsConnectionClosed = createAction(WS_CONNECTION_CLOSED);
export const wsGetMessage = createAction<IWsMessage>(WS_GET_MESSAGE);
export const wsSendMessage = createAction<unknown>(WS_SEND_MESSAGE);
export const wsConnecting = createAction(WS_CONNECTING);
export const wsDisconnect = createAction(WS_DISCONNECT);

export const wsActions = {
  wsInit: WS_CONNECTION_START,
  wsSendMessage: WS_SEND_MESSAGE,
  onOpen: WS_CONNECTION_SUCCESS,
  onClose: WS_CONNECTION_CLOSED,
  onError: WS_CONNECTION_ERROR,
  onMessage: WS_GET_MESSAGE,
  wsConnecting: WS_CONNECTING,
  wsDisconnect: WS_DISCONNECT,
};
