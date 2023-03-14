import { createSlice } from "@reduxjs/toolkit";
import { isAndroid, isIOS } from "react-device-detect";

const initialState = {
  openMessage: false,
  openAudio: false,
  openVideo: false,
  openMic: false,
  switchCamera: true,
  openTerminate: false,
  show: true,
  facingMode: isAndroid || isIOS ? "user" : "",
  typeAsteriskCall: "DIRECT",
};

const controlVideoSlice = createSlice({
  name: "controlVideo",
  initialState,
  reducers: {
    setControlMessage(state, action) {
      return { ...state, ["openMessage"]: action.payload };
    },
    setControlAudio(state, action) {
      return { ...state, ["openAudio"]: action.payload };
    },
    setControlVideo(state, action) {
      return { ...state, ["openVideo"]: action.payload };
    },
    setControlSwitchCamera(state, action) {
      return { ...state, ["facingMode"]: action.payload };
    },
    setControlMicrophone(state, action) {
      return { ...state, ["openMic"]: action.payload };
    },
    setControlTerminate(state, action) {
      return { ...state, ["openTerminate"]: action.payload };
    },
    setControlShow(state, action) {
      return { ...state, ["show"]: action.payload };
    },
    setControlTypeAsterisk(state, action) {
      return { ...state, ["typeAsteriskCall"]: action.payload };
    },
    resetControl() {
      return initialState;
    },
  },
});

export const {
  setControlMessage,
  setControlAudio,
  setControlVideo,
  setControlSwitchCamera,
  setControlMicrophone,
  setControlTerminate,
  setControlShow,
  setControlTypeAsterisk,
  resetControl,
} = controlVideoSlice.actions;
export default controlVideoSlice.reducer;
