const convert = require("xml-js");
import { isFirefox, isDesktop, isAndroid, isIOS } from "react-device-detect";

export const stopStreamElement = (videoElem) => {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(function (track) {
    track.stop();
  });
  videoElem.srcObject = null;
};
export const initConstraints = () => {
  if (isFirefox) {
    return {
      audio: {
        echoCancellation: true,
        googEchoCancellation: { exact: true },
        noiseSuppression: true,
        googNoiseSuppression: { exact: true },
      },
      video: {
        width: { max: 352 },
        height: { max: 240 },
        frameRate: {
          min: 15,
          max: 30,
        },
      },
    };
  }
  if (isDesktop) {
    return {
      audio: {
        echoCancellation: true,
        googEchoCancellation: { exact: true },
        noiseSuppression: true,
        googNoiseSuppression: { exact: true },
      },
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
      audio: {
        echoCancellation: true,
        googEchoCancellation: { exact: true },
        noiseSuppression: true,
        googNoiseSuppression: { exact: true },
      },
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
        // facingMode: { exact: "user" },
      },
    };
  }
  // facingMode: { exact: "user" },
  // default
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

export const adjustScreen = (mediaMatch, controlVideoMessage) => {
  // if (mediaMatch) {
  //     if (controlVideoMessage) {
  //         document.getElementById("slideMessage").style.display = "block";
  //         document.getElementById("img_vdocall").classList.add("vdo_call_show");
  //         document.getElementById("call-mobile").classList.add("call-mobile");
  //         document.getElementById("waiting_mobile").classList.add("waiting_mobile");
  //     } else {
  //         document.getElementById("slideMessage").style.display = "none";
  //         document.getElementById("img_vdocall").classList.remove("vdo_call_show");
  //         document.getElementById("call-mobile").classList.remove("call-mobile");
  //     }
  // } else {
  //     if (controlVideoMessage) {
  //         document.getElementById("mySidenav").style.width = "30%";
  //         document.getElementById("xxx").style.display = "block";
  //         document.getElementById("main").style.marginRight = "30%";
  //     } else {
  //         document.getElementById("mySidenav").style.width = "0";
  //         document.getElementById("xxx").style.display = "none";
  //         document.getElementById("main").style.marginRight = "0";
  //     }
  // }
};

export const previewText = (msgRealtime, message) => {
  var rs = convert.xml2json(message, { compact: true, spaces: 4 });
  rs = JSON.parse(rs);
  if (rs.rtt.t) {
    if (rs.rtt._attributes.event === "new") {
      return rs.rtt.t._text;
    } else if (rs.rtt._attributes.event === "reset") {
      if (rs.rtt.e) {
        var txt = rs.rtt.t[0]._text;
        var tmp;
        for (let index = 0; index < rs.rtt.e._attributes.n; index++) {
          tmp = removeCharacter(txt, rs.rtt.e._attributes.p - 1);
        }
        return tmp;
      } else {
        console.log("else1.1.2");
        console.log(rs.rtt.t._text);
        if (rs.rtt.t._text) {
          return rs.rtt.t._text;
        } else if (rs.rtt.t[0]._text) {
          if (rs.rtt.t[2]._text === undefined) {
            rs.rtt.t[2]._text = " ";
          }
          return rs.rtt.t[0]._text + "" + rs.rtt.t[2]._text;
        } else {
          return "";
        }
      }
    } else {
      if (rs.rtt.t._attributes) {
        console.log("else1.1.1");
        var add = addCharater(msgRealtime, rs.rtt.t._text, rs.rtt.t._attributes.p);
        return add;
      } else {
        console.log("else1.2.2");
        if (rs.rtt.t._text === undefined) {
          rs.rtt.t._text = " ";
        }
        if (msgRealtime === undefined) {
          msgRealtime = "";
        }
        var result = msgRealtime + "" + rs.rtt.t._text;
        if (result.trim() === "") {
          result;
        }
        return result;
      }
    }
  } else if (rs.rtt.e) {
    console.log("else2 remove");
    tmp = msgRealtime;
    for (let index = 0; index < rs.rtt.e._attributes.n; index++) {
      tmp = removeCharacter(msgRealtime, rs.rtt.e._attributes.p - 1);
    }
    return tmp;
  }
};
const addCharater = (str, stradd, char_pos) => {
  var output = [str.slice(0, char_pos), stradd, str.slice(char_pos)].join("");
  return output;
};
const removeCharacter = (str, char_pos) => {
  var part1 = str.substring(0, char_pos);
  var part2 = str.substring(char_pos + 1, str.length);
  return part1 + part2;
};
