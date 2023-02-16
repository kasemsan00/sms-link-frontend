import { motion } from "framer-motion";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { isDesktop, isIOS } from "react-device-detect";

export default function ControlPanel({ controlPanelRef, handleStopRecord, handleSwitchCamera, switchEnable }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed flex justify-center items-center z-50 w-full h-20 mt-10 bottom-5 bg-video-call"
      ref={controlPanelRef}
    >
      <motion.button
        className="p-3 mx-5 rounded-full bg-red-800 shadow-md drop-shadow-md hover:bg-slate-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleStopRecord}
      >
        <StopCircleIcon style={{ color: "white", width: "30px", height: "30px" }} />
      </motion.button>
      {!isDesktop && !isIOS ? (
        <motion.button
          className="p-3 mx-5 rounded-full bg-slate-600 shadow-md drop-shadow-md hover:bg-slate-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwitchCamera}
          disabled={switchEnable !== "done"}
        >
          <CameraswitchIcon style={{ color: "white", width: "30px", height: "30px" }} />
        </motion.button>
      ) : null}
    </motion.div>
  );
}
