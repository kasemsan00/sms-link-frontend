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

const DynamicStartRecord = dynamic(() => import("../../components/Record/StartRecord"));
const DynamicEndCall = dynamic(() => import("../../components/LinkCall/EndCall"));

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
    if (isSuccess) {
      dispatch(setLinkDetail(data));
      dispatch(setUserActiveStatus("open"));
    }
  }, [dispatch, isSuccess, data]);

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="rgb(219 56 102)" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        {isSuccess && data.status !== "close" ? (
          <Suspense fallback={`Loading...`}>
            <DynamicStartRecord uuid={uuid} />
          </Suspense>
        ) : null}
        {isSuccess && data.status === "close" ? (
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
