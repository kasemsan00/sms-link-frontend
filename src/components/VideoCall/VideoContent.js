import SwitchCamera from "./SwitchCamera";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";

// สลับกล้องเมื่อใช้งานวิดีโอคอลกับ Asterisk

export default function VideoContent({ localVideoRef, remoteVideoRef }) {
    const remoteVideoSectionRef = useRef(null);
    const localVideoSectionRef = useRef(null);

    return (
        <div className="bg-gray-800 h-[calc(100vh)] ">
            <div ref={localVideoSectionRef}>
                <video ref={localVideoRef} className="max-h-32 max-w-32" alt="localvideo" muted autoPlay playsInline />
                {isMobile ? <SwitchCamera /> : null}
            </div>
            <motion.div
                className="flex flex-1 justify-center items-center w-full h-[55vh] mobileSE:h-[55vh] mobile:h-[55vh] sm:h-[65vh] md:h-[65vh] xl:h-[70vh] 2xl:h-[70vh] bg-black"
                ref={remoteVideoSectionRef}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <video className="h-full" ref={remoteVideoRef} poster={require("../../assets/videocall/waiting.png")} autoPlay playsInline />
            </motion.div>
        </div>
    );
}
