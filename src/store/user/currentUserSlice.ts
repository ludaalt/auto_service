import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { RootState } from '../store';
import { IUser } from '../../types/types';
import API from '../../api/api';
import { SERVER_RESPONCE_CODE } from '../../const/const';

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/user');
      const data = await response.data;

      if (response.status === SERVER_RESPONCE_CODE.SUCCESS) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log('Error', err.response?.data);
        thunkAPI.rejectWithValue(err.response?.data);
      }
    }
  },
);

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    data: null as unknown as IUser,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.data = payload as IUser;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getCurrentUser.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isFetching = true;
      });
  },
});

export const getUserSelector = (state: RootState) => state.getUser;
