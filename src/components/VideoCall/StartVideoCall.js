import { useDispatch } from "react-redux";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import StatusbarGeo from "../Status/StatusBarGeo";
import Footer from "../Utilities/Footer";
import Header from "../Utilities/Header";
import useTranslation from "next-translate/useTranslation";
import StartCall from "../Utilities/StartCall";

export default function StartVideoCall({ uuid, extensionStatus }) {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const handleCall = () => {
    if (extensionStatus !== "close") {
      dispatch(setUserActiveStatus("makecall"));
      dispatch(setWebStatus("makecall"));
    }
  };

  return (
    <>
      <StatusbarGeo show={true} uuid={uuid} />
      <Header />
      <div
        className="flex flex-1 h-[calc(100vh-85px)] justify-center items-center
        sm:h-[calc(100vh)]
        "
      >
        <StartCall startRef={null} title={t("link-call")} handleClick={handleCall} />
      </div>
      <Footer />
    </>
  );
}
