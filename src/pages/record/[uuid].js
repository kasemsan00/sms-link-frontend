import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useQuery } from "react-query";
import { updateUserActiveStatus, getExtensionDetail } from "../../request";
import { useDispatch } from "react-redux";
import { setLinkDetail } from "../../redux/slices/linkDetailSlice";
import StatusbarGeo from "../../components/Status/StatusBarGeo";

const DynamicStartRecord = dynamic(() => import("../../components/Record/StartRecord"));
const DynamicEndCall = dynamic(() => import("../../components/LinkCall/EndCall"));

export default function UUID() {
    const router = useRouter();
    const uuid = router.query.uuid || "";
    const { t } = useTranslation("common");
    const dispatch = useDispatch();
    const { isSuccess, data } = useQuery([uuid], () => getExtensionDetail(uuid), {
        enabled: uuid !== "",
        staleTime: Infinity,
    });

    useEffect(() => {
        if (isSuccess) {
            dispatch(setLinkDetail(data));
        }
    }, [dispatch, isSuccess, data]);

    useEffect(() => {
        const controller = new AbortController();
        updateUserActiveStatus({
            uuid: uuid,
            status: "open",
            signal: controller.signal,
        });
        return () => controller.abort();
    }, [uuid]);

    return (
        <>
            <Head>
                <link rel="icon" type="image/x-icon" href="../favicon.png" />
                <title>{t("title")}</title>
            </Head>
            <main>
                {isSuccess && data.status !== "close" ? (
                    <Suspense fallback={`Loading...`}>
                        <DynamicStartRecord uuid={uuid} />
                    </Suspense>
                ) : (
                    <>
                        <StatusbarGeo show={true} />
                        <Suspense fallback={`Loading...`}>
                            <DynamicEndCall />
                        </Suspense>
                    </>
                )}
            </main>
        </>
    );
}
