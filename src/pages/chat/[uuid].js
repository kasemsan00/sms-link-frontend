import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getExtensionDetail, updateUserActiveStatus } from "../../request";
import { setLinkDetail } from "../../redux/slices/linkDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserAgent } from "../../redux/slices/sipSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import useTranslation from "next-translate/useTranslation";
import JsSIP from "jssip";
import StatusbarGeo from "../../components/Status/StatusBarGeo";
import Header from "../../components/Utilities/Header";
import LinkClose from "../../components/Static/LinkClose";
import Footer from "../../components/Utilities/Footer";
import URLExpired from "../../components/Static/URLExpired";

const DynamicChat = dynamic(() => import("../../components/ChatPage/Chat"));
const DynamicEndCall = dynamic(() => import("../../components/Static/EndCall"));

let userAgent = null;

export default function Chat() {
  const router = useRouter();
  const dispatch = useDispatch();
  const uuid = router.query.uuid || "";
  const { t } = useTranslation("common");
  const webStatus = useSelector((state) => state.webStatus);
  const queryExtension = useQuery([uuid], () => getExtensionDetail(uuid), {
    enabled: uuid !== "",
    staleTime: Infinity,
  });
  let { data } = queryExtension;

  useEffect(() => {
    if (queryExtension.isSuccess) {
      dispatch(setLinkDetail(data));
      if (data.status !== "close" && data.status !== "ERROR" && userAgent === null) {
        const socket = new JsSIP.WebSocketInterface(data.wss);
        const configuration = {
          sockets: [socket],
          uri: "sip:" + data.extension + "@" + data.domain,
          password: data.password,
        };
        userAgent = new JsSIP.UA(configuration);
        userAgent.on("unregistered", () => {
          console.log("unregistered");
          dispatch(setWebStatus("unregistered"));
          dispatch(setUserActiveStatus("failed"));
        });
        userAgent.on("registered", () => {
          console.log("registered");
          dispatch(setUserAgent(userAgent));
          dispatch(setWebStatus("registered"));
          dispatch(setUserActiveStatus("open"));
          updateUserActiveStatus({ uuid, status: "open" }).then((r) => r);
        });
        userAgent.on("registrationFailed", () => {
          console.log("registrationFailed");
          dispatch(setWebStatus("registrationFailed"));
        });
        userAgent.start();
      }
    }
  }, [uuid, dispatch, queryExtension.isSuccess, queryExtension]);

  if (data !== undefined && data.status === "close") {
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
  if (data !== undefined && data.status === "expired") {
    return (
      <>
        <StatusbarGeo show={true} uuid={uuid} />
        <Header />
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
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        {queryExtension.isSuccess === true ? (
          <>
            {queryExtension.data.status !== "close" && queryExtension.data.type === "chat" ? (
              <>
                {webStatus === "" || webStatus === "open" || webStatus === "registered" ? (
                  <Suspense fallback="Loading...">
                    <DynamicChat />
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
