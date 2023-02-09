import { useRef } from "react";
import { motion } from "framer-motion";

export default function Recording({ recordingRef, localVideoRef, isStartRecord }) {
  const recordingSectionRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-1 h-[calc(100vh)] justify-center items-center bg-video-call"
      ref={recordingRef}
    >
      <motion.div className="flex flex-1 items-center flex-col justify-center mt-[-100px]" ref={recordingSectionRef}>
        <video className="w-full h-full" ref={localVideoRef} autoPlay playsInline />
      </motion.div>
    </motion.div>
  );
}
