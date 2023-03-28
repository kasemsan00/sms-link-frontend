import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { motion } from "framer-motion";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { useMutation } from "react-query";
import { updateTerminateCall, updateUserActiveStatus } from "../../request/request";
import { useDispatch, useSelector } from "react-redux";
import useTranslation from "next-translate/useTranslation";

export default function Menu({ fontSize, setFontSize }) {
  const dispatch = useDispatch();
  const { t } = useTranslation("control");
  const uuid = useSelector((state) => state.linkDetail.uuid);
  const mutationTerminate = useMutation(updateTerminateCall);

  const textDecrease = (e) => {
    e.preventDefault();
    setFontSize(fontSize - 1);
    localStorage.setItem("fontSize", (fontSize - 1).toString());
  };
  const textIncrease = (e) => {
    e.preventDefault();
    setFontSize(fontSize + 1);
    localStorage.setItem("fontSize", (fontSize + 1).toString());
  };
  const exitChat = () => {
    mutationTerminate.mutate(
      { uuid },
      {
        onSuccess: async () => dispatch(setWebStatus("ended")),
      },
    );
    updateUserActiveStatus({
      uuid: uuid,
      status: "close",
      signal: undefined,
    }).then((r) => console.log(r));
  };

  return (
    <motion.div
      className="fixed flex flex-1 justify-center items-center top-0 z-50 bg-secondary w-full h-[50px] shadow-sm drop-shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="fixed flex flex-1 justify-center left-0 pl-1">
        <div className="mx-1 flex flex-1 items-center cursor-pointer" onClick={textIncrease}>
          <label className="text-[30px] cursor-pointer text-primary">{t("font-size.increase")}</label>
        </div>
        <div className="mx-1 flex flex-1 items-center cursor-pointer" onClick={textDecrease}>
          <label className="text-[30px] cursor-pointer text-primary">{t("font-size.decrease")}</label>
        </div>
      </div>
      <div className="fixed flex flex-1 justify-center">
        <div className="mx-1">
          <SupportAgentIcon style={{ color: "var(--primary)" }} fontSize="large" />
        </div>
        <div className="mx-1 flex flex-1 items-center text-xl font-medium text-primary">D1422</div>
      </div>
      <div className="fixed right-0 pr-1 cursor-pointer" onClick={exitChat}>
        <ExitToAppIcon style={{ color: "var(--primary)" }} fontSize="large" />
      </div>
    </motion.div>
  );
}
