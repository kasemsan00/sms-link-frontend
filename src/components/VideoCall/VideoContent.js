import SwitchCamera from "./SwitchCamera";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";

export default function VideoContent({ localVideoRef, remoteVideoRef }) {
  const remoteVideoDivRef = useRef(null);
  const localVideoDivRef = useRef(null);

  return (
    <div className="bg-video-call h-[calc(100vh)] ">
      <div className="fixed mt-[0px] z-50" ref={localVideoDivRef}>
        <video
          ref={localVideoRef}
          className="max-h-32 max-w-32 pt-[25px] rounded-md"
          alt="local video"
          muted
          autoPlay
          playsInline
        />
        {isMobile ? <SwitchCamera /> : null}
      </div>
      <motion.div
        className="mt-[15vh] fixed flex flex-1 justify-center items-center w-full h-[55vh] mobileSE:h-[55vh]
        mobile:h-[55vh] sm:h-[65vh] md:h-[65vh] xl:h-[70vh] 2xl:h-[70vh] bg-black"
        ref={remoteVideoDivRef}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <video
          className="h-full bg-black"
          ref={remoteVideoRef}
          poster={require("../../assets/videocall/waiting.png")}
          controls={false}
          autoPlay
          playsInline
        />
      </motion.div>
    </div>
  );
}
