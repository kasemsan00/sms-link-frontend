import Image from "next/image";
import { isMobile, useMobileOrientation } from "react-device-detect";
import { useLayoutEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef(null);
  const { isLandscape } = useMobileOrientation();

  useLayoutEffect(() => {
    if (isMobile && isLandscape) {
      footerRef.current.classList.add("hidden");
      return;
    }
    footerRef.current.classList.remove("hidden");
  }, [isLandscape, footerRef]);

  return (
    <div className="fixed bg-secondary bottom-0 h-16 w-full flex flex-1 justify-center items-center" ref={footerRef}>
      <label className={"mr-2 text-[13px] text-nstda-color font-bold"}>Power By</label>
      <Image
        className="w-[70px]"
        alt="footer-logo"
        width="auto"
        height="auto"
        priority
        src={require("../../assets/img/footer/logo.png")}
      />
    </div>
  );
}
