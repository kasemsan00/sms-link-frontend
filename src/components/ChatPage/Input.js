import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessageData } from "../../redux/slices/messageDataSlice";
import { motion } from "framer-motion";
import SendIcon from "@mui/icons-material/Send";
import useTranslation from "next-translate/useTranslation";

const initSequenceNumber = () => Math.floor(Math.random() * 100000 + 1);
let sequenceNumber = initSequenceNumber();
let eventRtt = "new";

export default function Input({ writeMessage, setWriteMessage, realtimeText, setRealtimeText, setIsDisplayMap }) {
  const { t } = useTranslation("common");
  const inputTextRef = useRef(null);
  const dispatch = useDispatch();
  const { userAgent } = useSelector((state) => state.sip);
  // const { agent, domain } = useSelector((state) => state.linkDetail);
  const agent = "1006";
  const domain = "sip-27.d1669.in.th";
  const [realtimeWriteMessage, setRealtimeWriteMessage] = useState("");

  // useEffect(() => inputTextRef.current.focus());

  const handleSendMessage = (event) => {
    if (event.key === "Enter") {
      sendMessage({ text: writeMessage });
      setWriteMessage("");
    }
  };
  const handleSendMessageButton = (event) => {
    if (event.target.value !== "") {
      sendMessage({ text: writeMessage });
      setWriteMessage("");
    }
  };

  useEffect(() => {
    if (writeMessage !== "") {
      if (eventRtt === "new") {
        eventRtt = "reset";
      }
    }
    setRealtimeWriteMessage(`<rtt event='${eventRtt}' seq='${sequenceNumber}'><t>${writeMessage}</t></rtt>`);
  }, [writeMessage, setRealtimeWriteMessage]);

  const handleOnChangeRtt = (event) => {
    sequenceNumber = sequenceNumber + 1;
    setWriteMessage(event.target.value);
  };

  const sendMessage = ({ text }) => {
    if (text.trim() !== "") {
      dispatch(addMessageData({ type: "local", body: text, date: "" }));
      setRealtimeWriteMessage(writeMessage);
      sequenceNumber = initSequenceNumber();
      eventRtt = "new";
    }
  };

  useEffect(() => {
    if (userAgent !== null) {
      userAgent.sendMessage(`sip:${agent}@${domain}`, realtimeWriteMessage);
    }
  }, [realtimeWriteMessage, userAgent]);

  return (
    <motion.div
      className="flex flex-1 justify-center items-center w-full fixed bottom-0 form-control chat-input"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ transition: 0.3 }}
    >
      <div className="input-group flex flex-1 justify-center items-center">
        <span className=" cursor-pointer bg-transparent " style={{ borderRadius: "50%" }} onClick={() => setIsDisplayMap(true)}>
          <Image width={50} height={50} alt="place-location" src={require("../../assets/img/placeholder.png")} />
        </span>
        <input
          className="input input-bordered w-full h-[44px] pl-0"
          style={{ outline: "none", border: "none" }}
          type="text"
          placeholder={t`chat-input-placeholder`}
          onKeyDown={handleSendMessage}
          onChange={handleOnChangeRtt}
          value={writeMessage}
          ref={inputTextRef}
        />
        <span
          className="bg-primary text-white cursor-pointer -rotate-45 w-[40px] h-[40px] first-letter:
                    flex flex-1 justify-center items-center m-1 hover:bg-focus
                "
          style={{ borderRadius: "50%" }}
          onClick={handleSendMessageButton}
        >
          <SendIcon />
        </span>
      </div>
    </motion.div>
  );
}
