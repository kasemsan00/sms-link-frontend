import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getExtensionDetail, updateUserActiveStatus } from "../../request";
import { setLinkDetail, setUUID } from "../../redux/slices/linkDetailSlice";
import { setUserAgent } from "../../redux/slices/sipSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import JsSIP from "jssip";
import useTranslation from "next-translate/useTranslation";
import StatusbarGeo from "../../components/Status/StatusBarGeo";
import Header from "../../components/Utilities/Header";
import LinkClose from "../../components/Static/LinkClose";
import Footer from "../../components/Utilities/Footer";
import CameraAccessWarning from "../../components/Static/CameraAccessWarning";
import Disconnected from "../../components/Static/Disconnected";

const DynamicLinkCall = dynamic(() => import("../../components/VideoCall/StartVideoCall"));
const DynamicVideoCall = dynamic(() => import("../../components/VideoCall/VideoCall"));
const DynamicEndCall = dynamic(() => import("../../components/Static/EndCall"));

let userAgent = null;

export default function UUID() {
  const router = useRouter();
  const uuid = router.query.uuid || "";
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
  const webStatus = useSelector((state) => state.webStatus);
  const userActiveStatus = useSelector((state) => state.userActiveStatus);
  const queryExtension = useQuery([uuid], () => getExtensionDetail(uuid), {
    enabled: uuid !== "",
    staleTime: Infinity,
  });
  let { data } = queryExtension;

  useQuery([uuid, userActiveStatus], () => updateUserActiveStatus({ uuid, status: userActiveStatus }), {
    enabled: uuid !== "" && userActiveStatus !== "",
    staleTime: Infinity,
  });

  useEffect(() => {
    if (uuid !== "") {
      dispatch(setUUID(uuid));
    }
  }, [dispatch, uuid]);

  useEffect(() => {
    if (queryExtension.isSuccess) {
      dispatch(setLinkDetail(data));
      if (data.status !== "close" && data.status !== "ERROR" && data.message !== "No data" && userAgent === null) {
        console.log("register", data);
        const socket = new JsSIP.WebSocketInterface(data.wss);
        const configuration = {
          sockets: [socket],
          uri: "sip:" + data.extension + "@" + data.domain,
          password: data.password,
        };
        userAgent = new JsSIP.UA(configuration);
        userAgent.on("unregistered", () => {
          dispatch(setWebStatus("unregistered"));
        });
        userAgent.on("registered", () => {
          dispatch(setUserAgent(userAgent));
          dispatch(setWebStatus("registered"));
          dispatch(setUserActiveStatus("open"));
        });
        userAgent.on("registrationFailed", () => {
          console.log("registrationFailed");
          dispatch(setWebStatus("registrationFailed"));
        });
        userAgent.on("disconnected", (e) => {
          console.log("disconnected", e);
          dispatch(setWebStatus("disconnected"));
        });
        userAgent.start();
      }
    }
  }, [dispatch, queryExtension.isSuccess, queryExtension, data]);

  // if (webStatus === "disconnected") {
  //   return (
  //     <>
  //       <StatusbarGeo show={true} uuid={uuid} />
  //       <Header />
  //       <Disconnected />
  //       <Footer />
  //     </>
  //   );
  // }

  if (data !== undefined && data.message === "No data") {
    return (
      <>
        <StatusbarGeo show={true} uuid={uuid} />
        <Header />
        <div className="flex flex-1 h-[calc(100vh-80px)] justify-center items-center landscape:mt-10">
          <LinkClose />
        </div>
        <Footer />
      </>
    );
  }

  if (data !== undefined && (data.status === "close" || data.status === "disconnected")) {
    return (
      <>
        <StatusbarGeo show={true} uuid={uuid} />
        <Header />
        <div className="flex flex-1 h-[calc(100vh-80px)] justify-center items-center landscape:mt-10">
          <LinkClose />
        </div>
        <Footer />
      </>
    );
  }

  if (webStatus === "CameraNotAllow") {
    return (
      <>
        <StatusbarGeo />
        <Header />
        <CameraAccessWarning />
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
        {queryExtension.isSuccess === true ? (
          <>
            {queryExtension.data.status !== "close" && queryExtension.data.type === "webrtc" ? (
              <>
                {webStatus === "" || webStatus === "open" || webStatus === "registered" ? (
                  <Suspense fallback={`Loading...`}>
                    <DynamicLinkCall extensionStatus={queryExtension.data.status} />
                  </Suspense>
                ) : null}
                {webStatus === "unregistered" || webStatus === "registrationFailed" ? (
                  <Suspense fallback="Loading...">
                    <DynamicEndCall />
                  </Suspense>
                ) : null}
                {webStatus === "makecall" ? (
                  <Suspense fallback="Loading...">
                    <DynamicVideoCall />
                  </Suspense>
                ) : null}
                {webStatus === "ended" ? (
                  <Suspense fallback="Loading...">
                    <DynamicEndCall />
                  </Suspense>
                ) : null}
              </>
            ) : null}
            {queryExtension.data.status === "close" ? (
              <Suspense fallback="Loading...">
                <DynamicEndCall />
              </Suspense>
            ) : null}
          </>
        ) : null}
      </main>
    </>
  );
}
