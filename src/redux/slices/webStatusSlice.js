import { createSlice } from "@reduxjs/toolkit";

const initialState = "";
const webStatusSlice = createSlice({
    name: "sip",
    initialState,
    reducers: {
        setWebStatus(state, action) {
            return action.payload;
        },
        resetWebStatus() {
            return initialState;
        },
    },
});
export const { setWebStatus, resetWebStatus } = webStatusSlice.actions;
export default webStatusSlice.reducer;
