import { useEffect } from "react";
import { useSelector } from "react-redux";
import StatusBarGeo from "../Status/StatusBarGeo";
import { updateTerminateCall } from "../../request/request";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import useTranslation from "next-translate/useTranslation";
import Rating from "../Rating/Rating";

export default function EndCall() {
  const { uuid, rate } = useSelector((state) => state.linkDetail);
  const { t } = useTranslation("common");
  useEffect(() => {
    const controller = new AbortController();
    updateTerminateCall({
      uuid: uuid,
      signal: controller.signal,
    }).then((r) => r);
    return () => controller.abort();
  }, [uuid]);

  return (
    <>
      <StatusBarGeo show={true} />
      <Header />
      <div className="flex flex-1 h-[calc(100vh-64px)] justify-center items-center landscape:mt-10">
        {rate !== 0 ? <div className="text-3xl text-end font-bold">{t("end-call")}</div> : <Rating uuid={uuid} />}
      </div>
      <Footer />
    </>
  );
}
