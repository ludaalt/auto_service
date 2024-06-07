import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import type { IProposal } from '../../types/types';
import type { RootState } from '../store';
import API from '../../api/api';

export const getProposals = createAsyncThunk<
  IProposal[],
  void,
  { rejectValue: AxiosError }
>('proposals/getProposals', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/proposals');

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const deleteProposal = createAsyncThunk<
  void,
  number,
  { rejectValue: AxiosError }
>('proposals/deleteProposal', async (id, { rejectWithValue }) => {
  try {
    const response = await API.delete(`/proposal/${id}`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const createNewProposal = createAsyncThunk<
  void,
  IProposal,
  { rejectValue: AxiosError }
>('proposals/createNewProposal', async (newProposal, { rejectWithValue }) => {
  try {
    const response = await API.post(`/proposal`, newProposal);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const updateDraftProposal = createAsyncThunk<
  void,
  IProposal,
  { rejectValue: AxiosError }
>(
  'proposals/updateDraftProposal',
  async (draftProposal, { rejectWithValue }) => {
    try {
      const response = await API.put(`/proposal`, draftProposal);

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log('Error', err.response?.data);
        return rejectWithValue(err.response?.data);
      }
    }
  },
);

export const getProposalById = createAsyncThunk<
  IProposal,
  number,
  { rejectValue: AxiosError }
>('proposals/getProposalById', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/proposal/${id}`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const getProposalStatus = createAsyncThunk<
  string,
  number,
  { rejectValue: AxiosError }
>('proposals/getProposalStatus', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/proposal/${id}/status`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const sentReadyDraft = createAsyncThunk<
  void,
  IProposal,
  { rejectValue: AxiosError }
>('proposals/sentReadyDraft', async (proposal, { rejectWithValue }) => {
  try {
    const ID = proposal.id;
    const response = await API.get(`/proposal/${ID}/send`);

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      console.log('Error', err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
});

export const ProposalsSlice = createSlice({
  name: 'proposals',
  initialState: {
    data: [] as IProposal[] | [],
    isFetching: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
    currentProposal: null as IProposal,
    currentProposalStatus: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProposals.fulfilled, (state, { payload }) => {
        state.data = payload;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getProposals.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getProposals.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => {
          return item.id !== +action.meta.arg;
        });
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(deleteProposal.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(deleteProposal.pending, (state) => {
        state.isFetching = true;
      })

      .addCase(createNewProposal.fulfilled, (state, { payload }) => {
        state.data = state.data.concat(payload as IProposal);
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(createNewProposal.rejected, (state) => {
        state.isFetching = false;
        state.isError = true;
      })
      .addCase(createNewProposal.pending, (state) => {
        state.isFetching = true;
      })

      .addCase(updateDraftProposal.fulfilled, (state, { payload }) => {
        const existingInStateDraft = current(state).data.find(
          (item) => item.id === payload.id,
        );

        if (existingInStateDraft) {
          const draft = current(state).data.find(
            (item) => item.id === payload.id,
          );

          state.data = state.data.map((item) =>
            +item.id === +draft.id ? payload : item,
          );
        } else {
          state.data = state.data.concat(payload);
        }

        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })

      .addCase(sentReadyDraft.fulfilled, (state, action) => {
        const readyDraft = current(state).data.find((item) => {
          return item.id === +action.meta.arg.id;
        });

        state.data = state.data.map((item) =>
          +item.id === +readyDraft.id
            ? { ...readyDraft, status: 'PENDING' }
            : item,
        );

        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })

      .addCase(getProposalById.fulfilled, (state, { payload }) => {
        state.currentProposal = state.data.find(
          (item) => item.id === +payload.id,
        ) as IProposal;
        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getProposalById.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getProposalById.pending, (state) => {
        state.isFetching = true;
      })

      .addCase(getProposalStatus.fulfilled, (state, { payload }) => {
        if (payload !== 'PENDING') {
          state.currentProposal.status.code = payload;
        }

        state.isFetching = false;
        state.isSuccess = true;
        return state;
      })
      .addCase(getProposalStatus.rejected, (state, { payload }) => {
        state.isFetching = false;
        state.isError = true;
        state.errorMessage = (payload as AxiosError).message;
      })
      .addCase(getProposalStatus.pending, (state) => {
        state.isFetching = true;
      });
  },
});

export const getProposalsSelector = (state: RootState) => state.getProposals;
