import { describe, expect, it } from 'vitest';

import {
  registerSuccess,
  loginSuccess,
  getUserSuccess,
  updateUserSuccess,
  logoutSuccess,
} from '../auth/actions';
import userReducer from './slice';

import type { IUser } from '../../utils/types';

describe('user slice', () => {
  const mockUser: IUser = {
    email: 'test@test.com',
    name: 'Test User',
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: 'Bearer test-token',
    refreshToken: 'test-refresh-token',
  };

  const mockUserResponse = {
    user: mockUser,
  };

  const initialState = {
    user: null,
  };

  const stateWithUser = {
    user: mockUser,
  };

  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('registerSuccess', () => {
    it('должен устанавливать пользователя при успешной регистрации', () => {
      const action = registerSuccess(mockAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toEqual({
        user: mockUser,
      });
    });

    it('должен игнорировать токены и сохранять только пользователя', () => {
      const action = registerSuccess(mockAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).not.toHaveProperty('accessToken');
      expect(newState).not.toHaveProperty('refreshToken');
      expect(newState.user).toEqual(mockUser);
    });

    it('должен заменять существующего пользователя при регистрации', () => {
      const newUser: IUser = {
        email: 'new@test.com',
        name: 'New User',
      };

      const newAuthResponse = {
        user: newUser,
        accessToken: 'Bearer new-token',
        refreshToken: 'new-refresh-token',
      };

      const action = registerSuccess(newAuthResponse);
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual({
        user: newUser,
      });
    });
  });

  describe('loginSuccess', () => {
    it('должен устанавливать пользователя при успешном входе', () => {
      const action = loginSuccess(mockAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toEqual({
        user: mockUser,
      });
    });

    it('должен игнорировать токены и сохранять только пользователя', () => {
      const action = loginSuccess(mockAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).not.toHaveProperty('accessToken');
      expect(newState).not.toHaveProperty('refreshToken');
      expect(newState.user).toEqual(mockUser);
    });

    it('должен заменять существующего пользователя при входе', () => {
      const newUser: IUser = {
        email: 'new@test.com',
        name: 'New User',
      };

      const newAuthResponse = {
        user: newUser,
        accessToken: 'Bearer new-token',
        refreshToken: 'new-refresh-token',
      };

      const action = loginSuccess(newAuthResponse);
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual({
        user: newUser,
      });
    });
  });

  describe('getUserSuccess', () => {
    it('должен устанавливать пользователя при получении данных', () => {
      const action = getUserSuccess(mockUserResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toEqual({
        user: mockUser,
      });
    });

    it('должен обновлять данные существующего пользователя', () => {
      const updatedUser: IUser = {
        email: 'updated@test.com',
        name: 'Updated User',
      };

      const action = getUserSuccess({ user: updatedUser });
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual({
        user: updatedUser,
      });
    });
  });

  describe('updateUserSuccess', () => {
    it('должен обновлять данные пользователя', () => {
      const updatedUser: IUser = {
        email: 'updated@test.com',
        name: 'Updated User',
      };

      const action = updateUserSuccess({ user: updatedUser });
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual({
        user: updatedUser,
      });
    });

    it('должен устанавливать пользователя если его не было', () => {
      const action = updateUserSuccess(mockUserResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toEqual({
        user: mockUser,
      });
    });
  });

  describe('logoutSuccess', () => {
    it('должен очищать пользователя при выходе', () => {
      const action = logoutSuccess();
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual({
        user: null,
      });
    });

    it('не должен изменять состояние если пользователь уже null', () => {
      const action = logoutSuccess();
      const newState = userReducer(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });

  describe('комплексные сценарии', () => {
    it('должен корректно обрабатывать последовательность действий', () => {
      let state = userReducer(initialState, registerSuccess(mockAuthResponse));
      expect(state.user).toEqual(mockUser);

      const updatedUser: IUser = {
        email: 'updated@test.com',
        name: 'Updated User',
      };

      state = userReducer(state, updateUserSuccess({ user: updatedUser }));
      expect(state.user).toEqual(updatedUser);

      state = userReducer(state, logoutSuccess());
      expect(state.user).toBeNull();

      const newUser: IUser = {
        email: 'new@test.com',
        name: 'New User',
      };

      const newAuthResponse = {
        user: newUser,
        accessToken: 'Bearer new-token',
        refreshToken: 'new-refresh-token',
      };

      state = userReducer(state, loginSuccess(newAuthResponse));
      expect(state.user).toEqual(newUser);
    });

    it('должен обрабатывать getUserSuccess после registerSuccess', () => {
      let state = userReducer(initialState, registerSuccess(mockAuthResponse));

      const freshUserData: IUser = {
        email: 'fresh@test.com',
        name: 'Fresh User',
      };

      state = userReducer(state, getUserSuccess({ user: freshUserData }));

      expect(state.user).toEqual(freshUserData);
    });
  });

  describe('граничные случаи', () => {
    it('должен игнорировать неизвестные действия', () => {
      const action = { type: 'unknown/action' };
      const newState = userReducer(stateWithUser, action);

      expect(newState).toEqual(stateWithUser);
    });

    it('должен корректно обрабатывать пользователя с минимальными данными', () => {
      const minimalUser: IUser = {
        email: 'minimal@test.com',
        name: 'Minimal',
      };

      const minimalAuthResponse = {
        user: minimalUser,
        accessToken: 'Bearer token',
        refreshToken: 'refresh',
      };

      const action = loginSuccess(minimalAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toEqual({
        user: minimalUser,
      });
    });

    it('должен сохранять структуру состояния', () => {
      const action = loginSuccess(mockAuthResponse);
      const newState = userReducer(initialState, action);

      expect(newState).toHaveProperty('user');
      expect(newState.user).toHaveProperty('email');
      expect(newState.user).toHaveProperty('name');
      expect(Object.keys(newState)).toHaveLength(1);
    });
  });
});
