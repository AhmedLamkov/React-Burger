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
};

export type TConstructorIngredient = TIngredient & {
  uniqueId?: string;
};

export type IApiResponse<T> = {
  success: boolean;
  data: T;
};

export type TIngredientsResponse = IApiResponse<TIngredient[]>;

export type TOrderResponse = IApiResponse<{
  name: string;
  order: {
    number: number;
  };
}>;
