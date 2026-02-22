import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@lib/rtk/api/apiSlice";

import authReducer from "@lib/rtk/auth/authSlice";
import appReducer from "@lib/rtk/app/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (gdm) => gdm().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
