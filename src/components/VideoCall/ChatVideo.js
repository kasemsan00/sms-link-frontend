import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { sendLocation } from "../../request/request";
import useTranslation from "next-translate/useTranslation";
import AutorenewIcon from "@mui/icons-material/Autorenew";
const { detect } = require("detect-browser");
const browser = detect();

const ICRM_MAP_URL = process.env.NEXT_PUBLIC_ICRM_MAP_URL;
const initSequenceNumber = () => Math.floor(Math.random() * 100000 + 1);
let sequenceNumber = initSequenceNumber();
let eventRtt = "new";

const MessageStatic = ({ type, body, setDisplayMap }) => {
  const { t } = useTranslation("common");
  const handleOpenMap = (url) => {
    url = url.replace("@URL:" + ICRM_MAP_URL + "/", "");
    const latLng = url.split("/");
    setDisplayMap({
      latitude: parseFloat(latLng[0]),
      longitude: parseFloat(latLng[1]),
    });
    // const googleMapUrl = "https://www.google.co.th/maps/@" + latLng[0] + "," + latLng[1];
    // window.open(googleMapUrl, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,width=600,height=600");
  };
  if (body.startsWith("@SMS:")) {
    return null;
  }
  if (body.startsWith("@URL:")) {
    return (
      <div className="flex flex-1 relative whitespace-pre-wrap w-[100%-15px] top-[8px] pl-[5px]">
        <div className="inline-block w-[40px] min-w-fit text-[14px]"></div>
        <div
          className={`${type === "remote" ? "text-[#39acfc]" : "text-white"} text-white inline-block text-[14px] break-normal`}
        >
          <Image
            className="cursor-pointer mb-[2px]"
            onClick={() => handleOpenMap(body)}
            src={require("../../assets/img/map.png")}
            alt="map"
            width={40}
            height={40}
          ></Image>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-1 relative whitespace-pre-wrap w-[100%-15px] top-[8px] pl-[5px]">
      <div className={`${type === "remote" ? "text-[#39acfc]" : "text-orange-400"}  inline-block w-[40px] min-w-fit text-[14px]`}>
        {type === "remote" ? t("chat-agent") + ": " : t("chat-client") + ": "}
      </div>
      <div className={`${type === "remote" ? "text-[#39acfc]" : "text-white"} text-white inline-block text-[14px] break-normal`}>
        {body}
      </div>
    </div>
  );
};
const MessageRealTime = ({ type, body }) => {
  const { t } = useTranslation("common");
  if (body !== "" && body !== undefined) {
    return (
      <div className="flex flex-1 relative whitespace-pre-wrap w-[100%-15px] top-[8px] pl-[5px]">
        <div
          className={`${
            type === "remote" ? "text-[#39acfc]" : "text-orange-400"
          }  inline-block w-[40px] min-w-fit font-bold text-[14px]`}
        >
          {type === "remote" ? t("chat-agent") + ": " : t("chat-client") + ": "}
        </div>
        <div className="text-white inline-block font-bold text-[14px] break-words">{body}</div>
      </div>
    );
  }
  return null;
};

export default function ChatVideo({ realtimeText, setDisplayMap }) {
  const messagesEndRef = useRef(null);
  const { t } = useTranslation("common");
  const messageData = useSelector((state) => state.messageData);
  const { openMessage } = useSelector((state) => state.controlVideo);
  const { userAgent } = useSelector((state) => state.sip);
  const { uuid, agent, domain } = useSelector((state) => state.linkDetail);
  const [writeMessage, setWriteMessage] = useState("");
  const [isGetLocationLoading, setIsGetLocationLoading] = useState(false);

  const handleInputSendMessage = (event) => {
    if (event.key === "Enter" && writeMessage.trim() !== "") {
      sendMessage({ text: writeMessage });
    }
  };
  const handleButtonSendMessage = () => {
    if (writeMessage.trim() !== "") {
      sendMessage({ text: writeMessage });
    }
  };
  const sendMessage = ({ text }) => {
    userAgent.sendMessage(`sip:${agent}@${domain}`, text);
    setWriteMessage("");
    sequenceNumber = initSequenceNumber();
    eventRtt = "new";
  };
  const handleOnChange = (event) => {
    setWriteMessage(event.target.value);
    if (writeMessage !== "" && eventRtt === "new") {
      eventRtt = "reset";
    }
    const rtt = `<rtt event='${eventRtt}' seq='${sequenceNumber}'><t>${writeMessage}</t></rtt>`;
    userAgent.sendMessage(`sip:${agent}@${domain}`, rtt);
  };

  const handleSendLocation = () => {
    console.log("handleSendLocation");
    // const latitude = localStorage.getItem("latitude");
    // const longitude = localStorage.getItem("longitude");
    // const accuracy = localStorage.getItem("accuracy");
    // if (latitude === null) {
    //   userAgent.sendMessage(`sip:${agent}@${domain}`, t("send-coordinates-error"));
    //   alert(t("alert-allow-location-service"));
    //   return;
    // }
    // sendLocation({
    //   os: browser.os,
    //   accuracy: parseInt(accuracy),
    //   latitude: parseFloat(latitude),
    //   longitude: parseFloat(longitude),
    //   uuid: uuid,
    // }).then((r) => {
    //   console.log(r);
    // });
    const sendUri = `sip:${agent}@${domain}`;
    // // userAgent.sendMessage(sendUri, "@URL:" + ICRM_MAP_URL + "/" + latitude + "/" + longitude);
    // // userAgent.sendMessage(sendUri, t("send-coordinates-success"));
    setIsGetLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGetLocationLoading(false);
        userAgent.sendMessage(sendUri, "@URL:" + ICRM_MAP_URL + "/" + position.coords.latitude + "/" + position.coords.longitude);
        userAgent.sendMessage(sendUri, t("send-coordinates-success"));
        sendLocation({
          os: browser.os,
          accuracy: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          uuid: uuid,
        }).then((r) => {
          console.log(r);
        });
      },
      (err) => {
        setIsGetLocationLoading(false);
        console.log(err);
        if (err.message === "User denied Geolocation") {
          userAgent.sendMessage(`sip:${agent}@${domain}`, t("send-coordinates-error"));
          alert(t("alert-allow-location-service"));
        }
      },
    );
  };

  const scrollToBottom = () => messagesEndRef.current.scrollIntoView({ behavior: "instant" });
  useEffect(scrollToBottom, [messageData]);
  useEffect(scrollToBottom, [realtimeText.body]);

  return (
    <div className="fixed bottom-0 w-full justify-center items-center">
      <div className="flex flex-1 justify-center items-center w-full" style={{ display: !openMessage ? "none" : "" }}>
        <div className="form-control w-full">
          <label className="input-group">
            <button
              className="bg-sky-800 cursor-pointer w-[60px] flex justify-center items-center"
              style={{ borderRadius: "0" }}
              onClick={handleSendLocation}
              disabled={isGetLocationLoading}
            >
              {isGetLocationLoading ? (
                <AutorenewIcon className="text-white w-[60px] animate-spin" />
              ) : (
                <Image width={30} height={30} alt="place location" src={require("../../assets/img/placeholder.png")} />
              )}
            </button>
            <input
              className="input input-bordered w-full"
              style={{ outline: "none" }}
              type="text"
              placeholder={t("chat-input-placeholder")}
              onKeyDown={handleInputSendMessage}
              onChange={handleOnChange}
              value={writeMessage}
            />
            <button
              className="bg-sky-800 text-white cursor-pointer w-[60px]"
              style={{ borderRadius: "0" }}
              onClick={handleButtonSendMessage}
            >
              {t("chat-send-button")}
            </button>
          </label>
        </div>
      </div>
      <div
        className="fixed top-[21px] h-[108px]  overflow-y-scroll right-0 bg-video-control rounded-xl"
        style={{ display: !openMessage ? "none" : "" }}
      >
        <div className="w-[200px] h-[108px] max-h-[108px] table-cell align-bottom  z-50 rounded-xl break-all">
          {messageData.map((chatData, index) => {
            return <MessageStatic key={index} type={chatData.type} body={chatData.body} setDisplayMap={setDisplayMap} />;
          })}
          <MessageRealTime type={realtimeText.type} body={realtimeText.body} />
          <div ref={messagesEndRef}></div>
        </div>
      </div>
    </div>
  );
}
