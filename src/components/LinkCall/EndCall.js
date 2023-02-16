import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusBarGeo from "../Status/StatusBarGeo";
import { updateTerminateCall } from "../../request";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import useTranslation from "next-translate/useTranslation";

export default function EndCall() {
  const { uuid } = useSelector((state) => state.linkDetail);
  const { t } = useTranslation("common");
  const sip = useSelector((state) => state.sip.session);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserActiveStatus("close"));
  }, [dispatch]);
  useEffect(() => {
    const controller = new AbortController();
    updateTerminateCall({
      uuid: uuid,
    }).then((r) => r);
    return () => controller.abort();
  }, [uuid]);
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
      <div className="flex flex-1 h-[calc(100vh-85px)] justify-center items-center landscape:mt-10">
        <div className="text-3xl text-primary font-bold">{t("end-call")}</div>
      </div>
      <Footer />
    </>
  );
}
