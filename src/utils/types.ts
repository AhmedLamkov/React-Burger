export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'main' | 'sauce';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
  count?: number;
  uniqueId?: string;
};

export type TConstructorIngredient = TIngredient & {
  uniqueId?: string;
};

export type IOrderData = {
  number: number;
  name?: string;
};
export type IBaseApiResponse = {
  success: boolean;
  message?: string;
};

export type IOrderResponse = {
  name?: string;
  order: {
    number: number;
    name?: string;
  };
} & IBaseApiResponse;

export type IIngredientsResponse = {
  data: TIngredient[];
} & IBaseApiResponse;
