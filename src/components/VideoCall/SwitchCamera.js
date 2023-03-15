import Image from "next/image";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setControlSwitchCamera } from "../../redux/slices/controlVideoSlice";
import useTranslation from "next-translate/useTranslation";
// import useTranslation from "next-translate/useTranslation";

// const FrontCamera = () => {
//   const { t } = useTranslation("common");
//   return <></>;
// };
// const BackCamera = () => {
//   const { t } = useTranslation("common");
//   return <></>;
// };

export default function SwitchCamera() {
  const { t } = useTranslation("common");
  const switchCameraRef = useRef(null);
  const dispatch = useDispatch();
  const { facingMode } = useSelector((state) => state.controlVideo);
  const openMessage = useSelector((state) => state.controlVideo.openMessage);

  const handleSwitchCamera = () => {
    if (facingMode === "" || facingMode === "user") {
      dispatch(setControlSwitchCamera("environment"));
    } else {
      dispatch(setControlSwitchCamera("user"));
    }
  };

  return (
    <div
      onClick={handleSwitchCamera}
      style={{
        marginRight: openMessage === true ? "200px" : "0px",
      }}
      className="top-[45px] right-0 w-[60px] h-[60px] fixed flex flex-col justify-center items-center cursor-pointer z-50] rounded-md"
      ref={switchCameraRef}
    >
      {/*{facingMode === "user" || facingMode === "" ? <BackCamera /> : <FrontCamera />}*/}
      <div
        className="flex flex-1 flex-col justify-center items-center"
        style={{ display: facingMode === "user" || facingMode === "" ? "none" : "" }}
      >
        <Image src={require("../../assets/videocall/btn_camera_switch_front.png")} width={40} height={40} alt="Camera Front" />
        <div className="mt-[3px] text-[13px] text-white text-center">{t("back-camera")}</div>
      </div>
      <div
        className="flex flex-1 flex-col justify-center items-center"
        style={{ display: facingMode === "user" || facingMode === "" ? "" : "none" }}
      >
        <Image src={require("../../assets/videocall/btn_camera_switch_back.png")} width={40} height={40} alt="Camera Back" />
        <div className="mt-[3px] text-[13px] text-white text-center">{t("front-camera")}</div>
      </div>
    </div>
  );
}
