import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userAgent: null,
    session: null,
};
const sipSlice = createSlice({
    name: "sip",
    initialState,
    reducers: {
        setUserAgent(state, action) {
            return { ...state, ["userAgent"]: action.payload };
        },
        setSession(state, action) {
            return { ...state, ["session"]: action.payload };
        },
        resetSip() {
            return initialState;
        },
    },
});
export const { setUserAgent, setSession, resetSip } = sipSlice.actions;
export default sipSlice.reducer;
