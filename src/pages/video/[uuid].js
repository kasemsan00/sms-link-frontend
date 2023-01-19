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

const DynamicLinkCall = dynamic(() => import("../../components/LinkCall"));
const DynamicVideoCall = dynamic(() => import("../../components/VideoCall"));
const DynamicEndCall = dynamic(() => import("../../components/LinkCall/EndCall"));

let userAgent = null;

const UUID = () => {
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
      let { data } = queryExtension;
      dispatch(setLinkDetail(data));
      if (data.status !== "close" && data.status !== "ERROR" && userAgent === null) {
        console.log("register");
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
    }
  }, [dispatch, queryExtension.isSuccess, queryExtension]);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="#3A80DB" />
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
};
export default UUID;
