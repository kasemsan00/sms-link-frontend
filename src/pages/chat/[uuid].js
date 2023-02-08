import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { getExtensionDetail } from "../../request";
import { setLinkDetail } from "../../redux/slices/linkDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserAgent } from "../../redux/slices/sipSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import useTranslation from "next-translate/useTranslation";
import JsSIP from "jssip";

const DynamicChat = dynamic(() => import("../../components/ChatPage/Chat"));
const DynamicEndCall = dynamic(() => import("../../components/LinkCall/EndCall"));

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

  useEffect(() => {
    if (queryExtension.isSuccess) {
      let { data } = queryExtension;
      dispatch(setLinkDetail(data));
      if (data.status !== "close" && data.status !== "ERROR" && userAgent === null) {
        const socket = new JsSIP.WebSocketInterface(data.wss);
        const configuration = {
          sockets: [socket],
          uri: "sip:" + data.extension + "@" + "sip-93.d1669.in.th",
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
        });
        userAgent.on("registrationFailed", () => {
          console.log("registrationFailed");
          dispatch(setWebStatus("registrationFailed"));
        });
        userAgent.start();
      }

      // For Demo
      // if (userAgent === null) {
      //     console.log("register");
      //     const socket = new JsSIP.WebSocketInterface("wss://sip-27.d1669.in.th:8002/ws");
      //     const configuration = {
      //         sockets: [socket],
      //         uri: "sip:" + "1582172490" + "@" + "sip-27.d1669.in.th",
      //         password: "test1234",
      //     };
      //     userAgent = new JsSIP.UA(configuration);
      //     userAgent.on("unregistered", () => {
      //         console.log("unregistered");
      //         dispatch(setWebStatus("unregistered"));
      //         dispatch(setUserActiveStatus("failed"));
      //     });
      //     userAgent.on("registered", () => {
      //         console.log("registered");
      //         dispatch(setUserAgent(userAgent));
      //         dispatch(setWebStatus("registered"));
      //         dispatch(setUserActiveStatus("open"));
      //     });
      //     userAgent.on("registrationFailed", () => {
      //         console.log("registrationFailed");
      //         dispatch(setWebStatus("registrationFailed"));
      //     });
      //     userAgent.start();
      // }
    }
  }, [dispatch, queryExtension.isSuccess, queryExtension]);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="#2D683E" />
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
