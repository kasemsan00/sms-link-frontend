import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { useQuery } from "react-query";
import { updateUserActiveStatus, getExtensionDetail } from "../../request";
import { useDispatch, useSelector } from "react-redux";
import { setLinkDetail } from "../../redux/slices/linkDetailSlice";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import URLExpired from "../../components/Static/URLExpired";
import StatusbarGeo from "../../components/Status/StatusBarGeo";
import Footer from "../../components/Utilities/Footer";
import UploadComplete from "../../components/Static/UploadComplete";

const DynamicStartRecord = dynamic(() => import("../../components/Record/StartRecord"));
const DynamicEndCall = dynamic(() => import("../../components/Static/EndCall"));

export default function UUID() {
  const router = useRouter();
  const uuid = router.query.uuid || "";
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const userActiveStatus = useSelector((state) => state.userActiveStatus);
  const { isSuccess, data } = useQuery([uuid], () => getExtensionDetail(uuid), {
    enabled: uuid !== "",
    staleTime: Infinity,
  });
  useQuery([uuid, userActiveStatus], () => updateUserActiveStatus({ uuid, status: userActiveStatus }), {
    enabled: uuid !== "" && userActiveStatus !== "",
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data.status !== "expired" && data.status !== "close") {
      dispatch(setLinkDetail(data));
      dispatch(setUserActiveStatus("open"));
    }
  }, [dispatch, isSuccess, data]);

  if (data !== undefined && data.status === "close") {
    return (
      <>
        <StatusbarGeo show={true} uuid={uuid} />
        <div className="flex flex-1 h-[calc(100vh-80px)] justify-center items-center landscape:mt-10">
          <UploadComplete uploadProgress={100} textColor={"black"} />
        </div>
        <Footer />
      </>
    );
  }

  if (data !== undefined && data.status === "expired") {
    return (
      <>
        <StatusbarGeo show={true} uuid={uuid} />
        <div className="flex flex-1 h-[calc(100vh-80px)] justify-center items-center landscape:mt-10">
          <URLExpired />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="rgb(219 56 102)" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        {isSuccess && data !== undefined && data.status !== "close" ? (
          <Suspense fallback={`Loading...`}>
            <DynamicStartRecord uuid={uuid} />
          </Suspense>
        ) : null}
        {isSuccess && data !== undefined && data.status === "close" ? (
          <>
            <Suspense fallback={`Loading...`}>
              <DynamicEndCall />
            </Suspense>
          </>
        ) : null}
      </main>
    </>
  );
}
