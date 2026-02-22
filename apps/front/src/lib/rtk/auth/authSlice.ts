import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  activeSchoolId: string | null;
};

const initialState: AuthState = {
  activeSchoolId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveSchoolId(state, action: PayloadAction<string | null>) {
      state.activeSchoolId = action.payload;
    },
    clearActiveSchoolId(state) {
      state.activeSchoolId = null;
    },
  },
});

export const { setActiveSchoolId, clearActiveSchoolId } = authSlice.actions;
export default authSlice.reducer;
