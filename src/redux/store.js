import { configureStore } from "@reduxjs/toolkit";
import reduxThunk from "redux-thunk";
import locationSlice from "./slices/locationSlice";
import linkDetailSlice from "./slices/linkDetailSlice";
import sipSlice from "./slices/sipSlice";
import webStatusSlice from "./slices/webStatusSlice";
import controlVideoSlice from "./slices/controlVideoSlice";
import userActiveStatusSlice from "./slices/userActiveStatusSlice";
import messageDataSlice from "./slices/messageDataSlice";

const middleware = [reduxThunk];

const store = configureStore({
  reducer: {
    webStatus: webStatusSlice,
    userActiveStatus: userActiveStatusSlice,
    sip: sipSlice,
    linkDetail: linkDetailSlice,
    messageData: messageDataSlice,
    location: locationSlice,
    controlVideo: controlVideoSlice,
  },
  middleware,
});

export default store;
