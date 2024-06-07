import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { SERVER_RESPONCE_CODE } from '../../const/const';
import { ILogin } from '../../types/types';
import type { RootState } from '../store';
import API from '../../api/api';

export const loginUser = createAsyncThunk<
  null,
  ILogin,
  { rejectValue: AxiosError }
>('auth/loginUser', async (userData, thunkAPI) => {
  try {
    const authData = {
      login: (userData as unknown as ILogin).login,
      password: (userData as unknown as ILogin).password,
    };

    const response = await API.post('/auth', authData);
    const data = await response.data;

    if (response.status === SERVER_RESPONCE_CODE.AUTH_SUCCESS) {
      localStorage.setItem('token', data['access_token']);
      return data;
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  return Promise.resolve(localStorage.removeItem('token'));
});

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state) => {
        state.isFetching = false;
        state.isSuccess = true;
        state.isLogin = true;
        return state;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(loginUser.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isFetching = false;
        state.isLogin = false;
        return state;
      });
  },
});

export const authSelector = (state: RootState) => state.auth;
