export type IBaseApiResponse = {
  success: boolean;
  message?: string;
};

export type IIngredientsResponse = {
  data: TIngredient[];
} & IBaseApiResponse;

export type IOrderResponse = {
  order: IOrderData;
} & IBaseApiResponse;

export type IAuthResponse = {
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
} & IBaseApiResponse;

export type IUserResponse = {
  user: {
    email: string;
    name: string;
  };
} & IBaseApiResponse;

export type IForgotPasswordResponse = {
  message: string;
} & IBaseApiResponse;

export type IResetPasswordResponse = {
  message: string;
} & IBaseApiResponse;

export type ILogoutResponse = {
  message: string;
} & IBaseApiResponse;

export type ITokenResponse = {
  accessToken: string;
  refreshToken: string;
} & IBaseApiResponse;

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type IOrderData = {
  number: number;
  name: string;
  status: string;
  ingredients: string[];
  createdAt: string;
  updatedAt: string;
};

export type IUser = {
  email: string;
  name: string;
};
