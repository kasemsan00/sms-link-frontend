import Image from "next/image";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendLocation } from "../../request";
import { addMessageData } from "../../redux/slices/messageDataSlice";
import useTranslation from "next-translate/useTranslation";
const { detect } = require("detect-browser");
const browser = detect();

const initSequenceNumber = () => Math.floor(Math.random() * 100000 + 1);
let sequenceNumber = initSequenceNumber();
let eventRtt = "new";

const ResponsiveChatPush = (props) => {
  let originClass;
  if (props.origin === "local") {
    originClass = "chat-item-right-mobile";
  } else {
    originClass = "chat-item-left-mobile";
  }
  return (
    <div className="chat-row-mobile">
      <div className={originClass}>{props.message}</div>{" "}
    </div>
  );
};
const MessageRealTimeView = (props) => {
  if (props.messageRealtime !== "") {
    return (
      <div className="chat-row-mobile">
        <div className="chat-item-left-mobile">{props.messageRealtime}</div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default function ChatVideo({ realtimeText }) {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const chatRef = useRef(null);

  const messageData = useSelector((state) => state.messageData);
  const controlVideo = useSelector((state) => state.controlVideo);
  const { userAgent } = useSelector((state) => state.sip);
  const { uuid, agent, domain } = useSelector((state) => state.linkDetail);
  const messagesEndRef = useRef(null);

  const [writeMessage, setWriteMessage] = useState("");

  const handleSendMessage = (event) => {
    if (event.key === "Enter" && writeMessage.trim() !== "") {
      sendMessage({ text: writeMessage });
    }
  };
  const handleSendMessageButton = (event) => {
    if (event.target.value !== "") {
      sendMessage({ text: event.target.value });
    }
  };
  const sendMessage = ({ text }) => {
    // userAgent.sendMessage(`sip:${agent}@${domain}`, text);
    userAgent.sendMessage(`sip:14001@d1422-sip.ddc.moph.go.th`, text);
    setWriteMessage("");
    sequenceNumber = initSequenceNumber();
    eventRtt = "new";
  };
  const handleOnChange = (event) => {
    setWriteMessage(event.target.value);
  };
  const handleSendLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      sendLocation({
        os: browser.os,
        accuracy: position.coords.accuracy,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        uuid: uuid,
      }).then((r) => console.log(r));
      userAgent.sendMessage(`sip:${agent}@${domain}`, "ส่งพิกัดให้เจ้าหน้าที่เรียบร้อย");
    });
    dispatch(addMessageData({ type: "local", body: "ส่งพิกัดให้เจ้าหน้าที่เรียบร้อย", date: "" }));
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "instant" });
  };
  useEffect(scrollToBottom, [messageData]);
  useEffect(scrollToBottom, [controlVideo.show]);
  useLayoutEffect(() => {
    if (controlVideo.openMessage) {
      chatRef.current.classList.remove("hide");
    } else {
      chatRef.current.classList.add("hide");
    }
  }, [controlVideo.openMessage]);

  return (
    <div className="fixed bottom-0 w-full justify-center items-center" ref={chatRef}>
      <div className="flex flex-1 justify-center items-center w-full">
        <div className="form-control w-full">
          <label className="input-group">
            <span className="bg-sky-800" style={{ borderRadius: "0" }} onClick={handleSendLocation}>
              <Image width={30} height={30} alt="place location" src={require("../../assets/img/placeholder.png")} />
            </span>
            <input
              className="input input-bordered w-full"
              style={{ outline: "none" }}
              type="text"
              placeholder={t("chat-input-placeholder")}
              onKeyDown={handleSendMessage}
              onChange={handleOnChange}
              value={writeMessage}
            />
            <span className="bg-sky-800 text-white" style={{ borderRadius: "0" }} onClick={handleSendMessageButton}>
              {t("chat-send-button")}
            </span>
          </label>
        </div>
      </div>
      <div className="fixed top-[21px] right-0">
        <div className="table-cell align-bottom">
          <div className="w-[200px] h-[108px] float-right overflow-y-scroll z-50 rounded-xl break-all">
            {messageData.map((chatdata, index) => {
              return (
                <ResponsiveChatPush key={index} sender="" origin={chatdata.type} date={chatdata.date} message={chatdata.body} />
              );
            })}
            <MessageRealTimeView messageRealtime={realtimeText} />
            <div ref={messagesEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
