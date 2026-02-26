export type IWsOrder = {
  _id: string;
  ingredients: string[];
  status: 'done' | 'pending' | 'created';
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};

export type IWsMessage = {
  success: boolean;
  orders: IWsOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

export type IWsState = {
  wsConnected: boolean;
  wsConnecting: boolean;
  orders: IWsOrder[];
  total: number | null;
  totalToday: number | null;
  error: string | null;
};
