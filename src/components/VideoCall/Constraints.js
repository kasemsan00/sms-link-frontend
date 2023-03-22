import { isAndroid, isDesktop, isFirefox, isIOS } from "react-device-detect";

export const initConstraints = () => {
  if (isFirefox) {
    return {
      audio: true,
      video: {
        width: { ideal: 400 },
        height: { ideal: 400 },
        frameRate: {
          max: 30,
        },
      },
    };
  }
  if (isDesktop) {
    return {
      audio: true,
      video: {
        frameRate: {
          min: "15 ",
          max: "15",
        },
        width: {
          min: "352 ",
          max: "352 ",
        },
        height: {
          min: "240",
          max: "240",
        },
      },
    };
  }
  if (isAndroid || isIOS) {
    return {
      audio: true,
      video: {
        facingMode: {
          exact: "user",
        },
        frameRate: {
          min: "15 ",
          max: "15",
        },
        width: {
          min: "352 ",
          max: "352 ",
        },
        height: {
          min: "240",
          max: "240",
        },
      },
    };
  }
  return {
    audio: true,
    video: {
      frameRate: {
        min: "15 ",
        max: "15",
      },
      width: {
        min: "352 ",
        max: "352 ",
      },
      height: {
        min: "240",
        max: "240",
      },
    },
  };
};
