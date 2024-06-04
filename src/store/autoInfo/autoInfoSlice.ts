import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { RootState } from '../store';
import { IAutoData } from '../../types/types';
import API from '../../api/api';

export const getAutoInfo = createAsyncThunk<
  IAutoData[],
  void,
  { rejectValue: AxiosError }
>('autoInfo/getAutoInfo', async (_, thunkAPI) => {
  try {
    const response = await API.get('dictionary/AUTO');

    const data = await response.data;
    if (response.status === 200) {
      return data;
    } else {
      return thunkAPI.rejectWithValue(data);
    }
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return thunkAPI.rejectWithValue(err.response?.data);
    }
  }
});

export const AutoInfoSlice = createSlice({
  name: 'autoInfo',
  initialState: {
    data: [] as IAutoData[] | [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAutoInfo.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getAutoInfo.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getAutoInfo.pending, (state) => {
        state.isFetching = true;
      });
  },
});

export const getAutoInfoSelector = (state: RootState) => state.getAutoInfo;
