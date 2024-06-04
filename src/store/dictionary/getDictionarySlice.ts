import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { RootState } from '../store';
import { DICTIONARY_CODES } from '../../const/const';
import { IDictionary, DictionaryObject } from '../../types/types';
import API from '../../api/api';

export const getDictionary = createAsyncThunk<
  IDictionary[][] | undefined,
  void,
  { rejectValue: AxiosError }
>('dictionary/getDictionary', async (_, thunkAPI) => {
  try {
    // const response = await fetchDictionary();
    const response = await Promise.all(
      DICTIONARY_CODES.map((item) =>
        API.get<IDictionary[][]>(`dictionary/${item}`),
      ),
    );

    const data = Array.from(response).map((item) => item.data);
    if (data) {
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
});

export const DictionarySlice = createSlice({
  name: 'dictionary',
  initialState: {
    data: {} as DictionaryObject,
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getDictionary.fulfilled, (state, { payload }) => {
        if (payload) {
          state.data = payload.reduce((acc, item, index) => {
            return { ...acc, [DICTIONARY_CODES[index]]: item };
          }, {} as DictionaryObject);
        }
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getDictionary.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getDictionary.pending, (state) => {
        state.isFetching = true;
      });
  },
});

export const getDictionarySelector = (state: RootState) => state.getDictionary;
