import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setControlVideo, setControlMicrophone, setControlAudio, setControlMessage } from "../../redux/slices/controlVideoSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { resetUserAgent, resetSession } from "../../redux/slices/sipSlice";
import ControlButton from "./ControlButton";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import { updateUserActiveStatus } from "../../request";

export default function ControlVideo() {
  const controlVideoPanelRef = useRef(null);
  const dispatch = useDispatch();
  const { uuid } = useSelector((state) => state.linkDetail);
  const controlVideo = useSelector((state) => state.controlVideo);
  const messageData = useSelector((state) => state.messageData);
  const [bottomControl, setBottomControl] = useState(10);
  const { t } = useTranslation("control");
  const sip = useSelector((state) => state.sip);
  const [newMessage, setNewMessage] = useState(false);

  const handleOpenMessage = () => {
    setNewMessage(false);
    dispatch(setControlMessage(!controlVideo.openMessage));
  };

  const handleOpenVideo = () => {
    if (!controlVideo.openVideo) {
      console.log("Camera Muted");
      sip.session.mute({ video: true });
    } else {
      console.log("Camera Unmuted");
      sip.session.unmute({ video: true });
    }
    dispatch(setControlVideo(!controlVideo.openVideo));
  };
  const handleOpenMic = () => {
    if (!controlVideo.openMic) {
      console.log("Microphone Muted");
      sip.session.mute({ audio: true });
    } else {
      console.log("Microphone Unmuted");
      sip.session.unmute({ audio: true });
    }
    dispatch(setControlMicrophone(!controlVideo.openMic));
  };
  const handleOpenAudio = () => dispatch(setControlAudio(!controlVideo.openAudio));

  useEffect(() => {
    if (messageData.length === 0) {
      setNewMessage(false);
      return;
    }
    if (controlVideo.openMessage === true) {
      setNewMessage(false);
      return;
    }
    setNewMessage(true);
  }, [messageData, controlVideo.openMessage]);

  useEffect(() => {
    if (controlVideo.openMessage === false) {
      setBottomControl(10);
      return;
    }
    if (controlVideo.openMessage === true) {
      controlVideoPanelRef.current.scrollIntoView({ behavior: "smooth" });
      setBottomControl(60);
    }
  }, [controlVideo.openMessage]);

  const handleTerminate = () => {
    // request update user active status api
    updateUserActiveStatus({
      uuid: uuid,
      status: "close",
    }).then((r) => r);
    sip.userAgent.unregister();
    sip.userAgent.stop();
    dispatch(setWebStatus("ended"));
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
        isActive={controlVideo.openVideo}
        textActive={t`camera.off`}
        textUnActive={t`camera.on`}
        iconPath={require("../../assets/img/icon-novideo-white.png")}
      />
      <ControlButton
        handleClick={handleOpenMic}
        isActive={controlVideo.openMic}
        textActive={t("microphone.off")}
        textUnActive={t("microphone.on")}
        iconPath={require("../../assets/img/icon-mutemicrophone-white.png")}
      />
      <ControlButton
        handleClick={handleOpenAudio}
        isActive={controlVideo.openAudio}
        textActive={t("audio.off")}
        textUnActive={t("audio.on")}
        iconPath={require("../../assets/img/icon-volumeoff-white.png")}
      />
      <ControlButton
        handleClick={handleOpenMessage}
        isActive={controlVideo.openMessage}
        textActive={t("chat.off")}
        textUnActive={t("chat.on")}
        iconPath={require("../../assets/img/icon-message-white.png")}
      />
      <ControlButton
        handleClick={handleTerminate}
        isActive={controlVideo.openTerminate}
        textActive={t("terminate")}
        textUnActive={t("terminate")}
        iconPath={require("../../assets/img/icon-hangup-white.png")}
      />
    </motion.div>
  );
}
