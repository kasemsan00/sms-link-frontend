import { useRef } from "react";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";

export default function StartChat({ isStartChat, handleStartChat }) {
  const { t } = useTranslation("common");

  const startChatRef = useRef(null);
  const startCameraRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (isStartChat) {
      startChatRef.current.classList.add("hidden");
    } else {
      if (startChatRef.current.classList.contains("hidden")) {
        startChatRef.current.classList.remove("hidden");
      }
    }
  }, [isStartChat]);

  return (
    <div className="flex flex-1 h-[calc(100vh)] justify-center items-center" ref={startChatRef}>
      <motion.div
        className="flex mt-[-50px]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        ref={startCameraRef}
      >
        <motion.div
          className="
                            bg-[#D13A2E] w-[30vh] h-[30vh] rounded-full shadow-md drop-shadow-md shadow-gray-700 
                            text-2xl text-white flex flex-1 justify-center items-center text-center self-center cursor-pointer
                        "
          onClick={handleStartChat}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="w-[140px]">{t("start-chat")}</div>
        </motion.div>
      </motion.div>
    </div>
  );
}
