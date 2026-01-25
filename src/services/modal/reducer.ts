import { createReducer } from '@reduxjs/toolkit';

import { openModal, closeModal } from './actions';

import type { ModalData } from './actions';

export type IModalState = {
  isOpen: boolean;
  modalType: ModalData['type'];
  modalData: unknown;
};

const initialState: IModalState = {
  isOpen: false,
  modalType: null,
  modalData: null,
};

export const modalReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(openModal, (state, action) => {
      state.isOpen = true;
      state.modalType = action.payload.type;
      state.modalData = action.payload.data ?? null;
    })
    .addCase(closeModal, (state) => {
      state.isOpen = false;
      state.modalType = null;
      state.modalData = null;
    });
});
