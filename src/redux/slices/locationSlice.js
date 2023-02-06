import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: null,
    locationName: null,
    latitude: null,
    longitude: null,
    accuracy: null,
};

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocation(state, action) {
            return action.payload;
        },
        resetLocation() {
            return initialState;
        },
    },
});

export const { setLocation, resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
