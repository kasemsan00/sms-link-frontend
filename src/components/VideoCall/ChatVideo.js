import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { sendLocation } from "../../request";
// import { addMessageData } from "../../redux/slices/messageDataSlice";
import useTranslation from "next-translate/useTranslation";
const { detect } = require("detect-browser");
const browser = detect();

const initSequenceNumber = () => Math.floor(Math.random() * 100000 + 1);
let sequenceNumber = initSequenceNumber();
let eventRtt = "new";

const MessageStatic = ({ type, body }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-1 relative whitespace-pre-wrap w-[100%-15px] top-[8px] pl-[5px]">
      <div className={`${type === "remote" ? "text-[#39acfc]" : "text-white"}  inline-block w-[40px] min-w-fit text-[14px]`}>
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
        <div className="text-white inline-block font-bold text-[14px] break-normal">{body}</div>
      </div>
    );
  }
  return <></>;
};

export default function ChatVideo({ realtimeText }) {
  const messagesEndRef = useRef(null);
  const { t } = useTranslation("common");
  const messageData = useSelector((state) => state.messageData);
  const { openMessage } = useSelector((state) => state.controlVideo);
  const { userAgent } = useSelector((state) => state.sip);
  const { uuid, agent, domain } = useSelector((state) => state.linkDetail);
  const [writeMessage, setWriteMessage] = useState("");

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
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendLocation({
          os: browser.os,
          accuracy: position.coords.accuracy,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          uuid: uuid,
        }).then((r) => {
          const latLngText = t("coordinates") + " " + position.coords.latitude + ", " + position.coords.longitude;
          userAgent.sendMessage(`sip:${agent}@${domain}`, latLngText);
          userAgent.sendMessage(`sip:${agent}@${domain}`, t("send-coordinates-success"));
        });
      },
      (err) => {
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
            <span className="bg-sky-800 cursor-pointer" style={{ borderRadius: "0" }} onClick={handleSendLocation}>
              <Image width={30} height={30} alt="place location" src={require("../../assets/img/placeholder.png")} />
            </span>
            <input
              className="input input-bordered w-full"
              style={{ outline: "none" }}
              type="text"
              placeholder={t("chat-input-placeholder")}
              onKeyDown={handleInputSendMessage}
              onChange={handleOnChange}
              value={writeMessage}
            />
            <span
              className="bg-sky-800 text-white cursor-pointer"
              style={{ borderRadius: "0" }}
              onClick={handleButtonSendMessage}
            >
              {t("chat-send-button")}
            </span>
          </label>
        </div>
      </div>
      <div className="fixed top-[21px] right-0 bg-video-control rounded-xl">
        <div className="table-cell align-bottom">
          <div className="w-[200px] h-[108px] display:grid float-right overflow-y-scroll z-50 rounded-xl break-all">
            {messageData.map((chatData, index) => {
              return <MessageStatic key={index} sender="" type={chatData.type} date={chatData.date} body={chatData.body} />;
            })}
            <MessageRealTime type={realtimeText.type} body={realtimeText.body} />
            <div ref={messagesEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
