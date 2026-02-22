import { TNormalizedError } from "@/types/constant";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

type AppState = {
  lastError: TNormalizedError | null;
};

const initialState: AppState = {
  lastError: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLastError(state, action: PayloadAction<TNormalizedError>) {
      state.lastError = action.payload;
    },
    clearLastError(state) {
      state.lastError = null;
    },
  },
});

export const { setLastError, clearLastError } = appSlice.actions;
export default appSlice.reducer;
