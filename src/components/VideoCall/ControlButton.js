import Image from "next/image";
import { useRef } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { motion } from "framer-motion";

export default function ControlButton({ handleClick, isActive, textActive, textUnActive, iconPath }) {
  const controlButtonRef = useRef(null);
  const controlTextRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (isActive) {
      controlButtonRef.current.classList.replace("bg-video-call", "bg-gray-700");
      controlTextRef.current.innerHTML = textActive;
    } else {
      controlButtonRef.current.classList.replace("bg-gray-700", "bg-video-call");
      controlTextRef.current.innerHTML = textUnActive;
    }
  }, [isActive, textActive, textUnActive]);

  return (
    <div className="mx-1">
      <motion.button
        className="flex flex-1 flex-col justify-center items-center rounded-xl
        mobileSE:w-18 mobile:w-18 sm:w-24 md:w-24 lg:w-24 h-[60px] w-[60px] px-[35px]
        bg-video-call
        "
        onClick={handleClick}
        ref={controlButtonRef}
        whileTap={{ scale: 0.9 }}
      >
        <div className="flex flex-1 justify-center items-center h-[22px] w-[22px] mb-[18px]">
          <Image src={iconPath} alt="video" width="auto" height="auto" />
        </div>
        <div className="fixed text-sm mobileSE:text-xs mobile:text-xs text-white mt-[35px] w-[120px]" ref={controlTextRef}></div>
      </motion.button>
    </div>
  );
}
