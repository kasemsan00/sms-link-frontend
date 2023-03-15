import Image from "next/image";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setControlSwitchCamera } from "../../redux/slices/controlVideoSlice";
import useTranslation from "next-translate/useTranslation";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";

const FrontCamera = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Image
        src={require("../../assets/videocall/btn_camera_switch_back.png")}
        width={40}
        height={40}
        alt="Camera Back"
        className="switch-camera-image"
      />
      <div className="switch-camera-text">{t("front-camera")}</div>
    </>
  );
};
const BackCamera = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Image
        src={require("../../assets/videocall/btn_camera_switch_front.png")}
        width={40}
        height={40}
        alt="Camera Front"
        className="switch-camera-image"
      />
      <div className="switch-camera-text">{t("back-camera")}</div>
    </>
  );
};

export default function SwitchCamera() {
  const switchCameraRef = useRef(null);
  const dispatch = useDispatch();
  const { facingMode } = useSelector((state) => state.controlVideo);
  const openMessage = useSelector((state) => state.controlVideo.openMessage);

  useIsomorphicLayoutEffect(() => {
    if (openMessage === true) {
      switchCameraRef.current.classList.add("mr-[200px]");
    } else if (openMessage === false) {
      switchCameraRef.current.classList.remove("mr-[200px]");
    }
  }, [openMessage]);

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
      className="top-[45px] right-0 w-[60px] h-[60px] fixed flex flex-col justify-center items-center cursor-pointer z-50] rounded-md"
      ref={switchCameraRef}
    >
      {facingMode === "user" || facingMode === "" ? <BackCamera /> : <FrontCamera />}
    </div>
  );
}
