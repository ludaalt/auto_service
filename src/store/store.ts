import { configureStore } from '@reduxjs/toolkit';

import { AuthSlice } from './auth/authSlice';
import { ProposalsSlice } from './proposals/getproposalsSlice';
import { AutoInfoSlice } from './autoInfo/autoInfoSlice';
import { DictionarySlice } from './dictionary/getDictionarySlice';
import { UserSlice } from './user/currentUserSlice';

const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    getProposals: ProposalsSlice.reducer,
    getAutoInfo: AutoInfoSlice.reducer,
    getDictionary: DictionarySlice.reducer,
    getUser: UserSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;

export type RootThunkAPI = {
  getState: () => RootState;
  dispatch: AppDispatch;
};
