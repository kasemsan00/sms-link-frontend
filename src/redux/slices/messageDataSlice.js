import { createSlice } from "@reduxjs/toolkit";
const initialState = [];

const messageDataSlice = createSlice({
  name: "messageData",
  initialState,
  reducers: {
    addMessageData(state, action) {
      return [...state, action.payload];
    },
    resetMessageData() {
      return initialState;
    },
  },
});
export const { addMessageData, resetMessageData } = messageDataSlice.actions;
export default messageDataSlice.reducer;
