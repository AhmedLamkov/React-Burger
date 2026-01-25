import { createAction } from '@reduxjs/toolkit';

export type ModalType = 'ingredientDetails' | 'orderDetails' | null;

export type ModalData = {
  type: ModalType;
  data?: unknown;
};

export const openModal = createAction<ModalData>('modal/open');
export const closeModal = createAction('modal/close');
