import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setControlVideo, setControlMicrophone, setControlAudio, setControlMessage } from "../../redux/slices/controlVideoSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { resetUserAgent, resetSession } from "../../redux/slices/sipSlice";
import ControlButton from "./ControlButton";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";

export default function ControlVideo() {
  const controlVideoPanelRef = useRef(null);
  const dispatch = useDispatch();
  const { openMessage, openMic, openAudio, openVideo, openTerminate } = useSelector((state) => state.controlVideo);
  const messageData = useSelector((state) => state.messageData);
  const [bottomControl, setBottomControl] = useState(10);
  const { t } = useTranslation("control");
  const { userAgent, session } = useSelector((state) => state.sip);
  const [newMessage, setNewMessage] = useState(false);

  const handleOpenMessage = () => {
    setNewMessage(false);
    dispatch(setControlMessage(!openMessage));
  };

  const handleOpenVideo = () => {
    if (!openVideo) {
      console.log("Camera Muted");
      session.mute({ video: true });
    } else {
      console.log("Camera UnMute");
      session.unmute({ video: true });
    }
    dispatch(setControlVideo(!openVideo));
  };
  const handleOpenMic = () => {
    if (!openMic) {
      console.log("Microphone Muted");
      session.mute({ audio: true });
    } else {
      console.log("Microphone UnMute");
      session.unmute({ audio: true });
    }
    dispatch(setControlMicrophone(!openMic));
  };
  const handleOpenAudio = () => dispatch(setControlAudio(!openAudio));

  useEffect(() => {
    if (messageData.length === 0) {
      setNewMessage(false);
      return;
    }
    if (openMessage === true) {
      setNewMessage(false);
      return;
    }
    setNewMessage(true);
  }, [messageData, openMessage]);

  useEffect(() => {
    if (openMessage === false) {
      setBottomControl(10);
      return;
    }
    if (openMessage === true) {
      controlVideoPanelRef.current.scrollIntoView({ behavior: "smooth" });
      setBottomControl(60);
    }
  }, [openMessage]);

  const handleTerminate = () => {
    dispatch(setUserActiveStatus("close"));
    userAgent.unregister();
    userAgent.stop();
    dispatch(setWebStatus("close"));
    dispatch(resetUserAgent());
    dispatch(resetSession());
  };

  return (
    <motion.div
      ref={controlVideoPanelRef}
      className="fixed flex flex-1 w-full justify-center items-center animation"
      style={{ bottom: bottomControl, left: 0, zIndex: 1000 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ControlButton
        handleClick={handleOpenVideo}
        isActive={openVideo}
        textActive={t`camera.off`}
        textUnActive={t`camera.on`}
        iconPath={require("../../assets/img/icon-novideo-white.png")}
      />
      <ControlButton
        handleClick={handleOpenMic}
        isActive={openMic}
        textActive={t("microphone.off")}
        textUnActive={t("microphone.on")}
        iconPath={require("../../assets/img/icon-mutemicrophone-white.png")}
      />
      <ControlButton
        handleClick={handleOpenAudio}
        isActive={openAudio}
        textActive={t("audio.off")}
        textUnActive={t("audio.on")}
        iconPath={require("../../assets/img/icon-volumeoff-white.png")}
      />
      <ControlButton
        handleClick={handleOpenMessage}
        isActive={openMessage}
        textActive={t("chat.off")}
        textUnActive={t("chat.on")}
        badge={newMessage}
        iconPath={require("../../assets/img/icon-message-white.png")}
      />
      <ControlButton
        handleClick={handleTerminate}
        isActive={openTerminate}
        textActive={t("terminate")}
        textUnActive={t("terminate")}
        iconPath={require("../../assets/img/icon-hangup-white.png")}
      />
    </motion.div>
  );
}
