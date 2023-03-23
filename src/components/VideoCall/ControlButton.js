import Image from "next/image";
import { useRef } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { badge } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function ControlButton({ handleClick, isActive, textActive, textUnActive, iconPath, badge }) {
  const controlButtonRef = useRef(null);
  const controlTextRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (isActive) {
      controlButtonRef.current.classList.replace("bg-video-control", "bg-gray-700");
      controlTextRef.current.innerHTML = textActive;
    } else {
      controlButtonRef.current.classList.replace("bg-gray-700", "bg-video-control");
      controlTextRef.current.innerHTML = textUnActive;
    }
  }, [isActive, textActive, textUnActive]);

  return (
    <div className="mx-1">
      <motion.button
        className="flex flex-1 flex-col justify-center items-center rounded-xl
        landscape:w-0
        mobileSE:w-18
        mobile:w-18
        sm:w-24
        md:w-24
        lg:w-24
        h-[60px] w-[60px] px-[35px]
        bg-video-control
        "
        onClick={handleClick}
        ref={controlButtonRef}
        whileTap={{ scale: 0.9 }}
      >
        {badge ? (
          <div className="absolute rounded-full w-[20px] h-[20px] bg-red-600 text-white flex flex-1 items-center justify-center top-0 ml-[25px] font-bold w">
            !
          </div>
        ) : null}
        <div className="flex flex-1 justify-center items-center h-[22px] w-[22px] mb-[18px]">
          <Image src={iconPath} alt="video" width="auto" height="auto" />
        </div>
        <div className="fixed text-sm mobileSE:text-xs mobile:text-xs text-white mt-[35px] w-[120px]" ref={controlTextRef}></div>
      </motion.button>
    </div>
  );
}
