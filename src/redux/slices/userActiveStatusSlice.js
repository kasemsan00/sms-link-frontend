import { createSlice } from "@reduxjs/toolkit";

const initialState = "";
const userActiveStatusSlice = createSlice({
  name: "userActiveStatus",
  initialState,
  reducers: {
    setUserActiveStatus(state, action) {
      return action.payload;
    },
    resetUserActiveStatus() {
      return initialState;
    },
  },
});
export const { setUserActiveStatus, resetUserActiveStatus } = userActiveStatusSlice.actions;
export default userActiveStatusSlice.reducer;
