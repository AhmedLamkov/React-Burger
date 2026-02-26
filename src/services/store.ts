import { configureStore, type Action, type ThunkAction } from '@reduxjs/toolkit';

import { authMiddleware, socketMiddleware } from './middleware';
import { rootReducer } from './reducers';
import { wsActions } from './ws/actions';

const wsUrl = 'wss://norma.education-services.ru/orders';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authMiddleware, socketMiddleware(wsUrl, wsActions)),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
