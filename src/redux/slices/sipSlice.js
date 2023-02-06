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
        resetUserAgent(state) {
            return { ...state, ["userAgent"]: null };
        },
        resetSession(state) {
            return { ...state, ["session"]: null };
        },
    },
});
export const { setUserAgent, setSession, resetUserAgent, resetSession } = sipSlice.actions;
export default sipSlice.reducer;
