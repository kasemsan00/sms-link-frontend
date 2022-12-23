import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import StatusBarGeo from "../Status/StatusBarGeo";
import { updateTerminateCall } from "../../request";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import useTranslation from "next-translate/useTranslation";

export default function EndCall({ uuid }) {
    const { t } = useTranslation("common");
    const sip = useSelector((state) => state.sip.session);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(setUserActiveStatus("close"));
    }, [dispatch]);
    //
    // useQuery([uuid], () => updateTerminateCall({ uuid }), {
    //     enabled: uuid !== "",
    //     staleTime: Infinity,
    // });
    //
    // useEffect(() => {
    //     if (sip !== null) {
    //         sip.session.terminate();
    //     }
    // }, [sip]);
    //
    return (
        <>
            <StatusBarGeo show={true} />
            <Header />
            <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center">
                <div className="text-3xl text-[#214b74]">{t("end-call")}</div>
            </div>
            <Footer />
        </>
    );
}
