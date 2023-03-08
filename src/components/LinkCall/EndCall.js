import { useEffect } from "react";
import { useSelector } from "react-redux";
import StatusBarGeo from "../Status/StatusBarGeo";
import { updateTerminateCall, updateUserActiveStatus } from "../../request";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import useTranslation from "next-translate/useTranslation";

export default function EndCall() {
  const { uuid } = useSelector((state) => state.linkDetail);
  const { t } = useTranslation("common");
  // const sip = useSelector((state) => state.sip.session);
  useEffect(() => {
    const controller = new AbortController();
    updateTerminateCall({
      uuid: uuid,
      signal: controller.signal,
    }).then((r) => r);
    return () => controller.abort();
  }, [uuid]);

  // useEffect(() => {
  //   const controller = new AbortController();
  //   updateUserActiveStatus({
  //     uuid: uuid,
  //     status: "close",
  //     signal: controller.signal,
  //   }).then((r) => r);
  //   return () => controller.abort();
  // }, [uuid]);
  // useEffect(() => {
  //   if (sip !== null) {
  //     sip.session.terminate();
  //   }
  // }, [sip]);
  //
  return (
    <>
      <StatusBarGeo show={true} />
      <Header />
      <div className="flex flex-1 h-[calc(100vh-64px)] justify-center items-center landscape:mt-10">
        <div className="text-3xl text-primary font-bold">{t("end-call")}</div>
      </div>
      <Footer />
    </>
  );
}
