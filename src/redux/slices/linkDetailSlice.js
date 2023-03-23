import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  uuid: "",
  sms_code: "",
  status: "",
  type: "",
  extension: "",
  password: "",
  agent: "",
  conference: 0,
  domain: "",
  wss: "",
};
const linkDetailSlcie = createSlice({
  name: "linkDetail",
  initialState,
  reducers: {
    setUUID(state, action) {
      return { ...state, ["uuid"]: action.payload };
    },
    setCallNumber(state, action) {
      return { ...state, ["agent"]: action.payload.agent };
    },
    setLinkDetail(state, action) {
      return {
        ...state,
        ["uuid"]: action.payload.uuid,
        ["sms_code"]: action.payload.sms_code,
        ["status"]: action.payload.status,
        ["type"]: action.payload.type,
        ["extension"]: action.payload.extension,
        ["password"]: action.payload.password,
        ["agent"]: action.payload.agent,
        ["confernce"]: action.payload.conference,
        ["domain"]: action.payload.domain,
        ["wss"]: action.payload.wss,
      };
    },
    resetLinkDetail() {
      return initialState;
    },
  },
});
export const { setUUID, setLinkDetail, setCallNumber, resetLinkDetail } = linkDetailSlcie.actions;
export default linkDetailSlcie.reducer;
