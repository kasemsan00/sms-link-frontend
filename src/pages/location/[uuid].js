import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import { getExtensionDetail, updateUserActiveStatus } from "../../request";
import { setLinkDetail } from "../../redux/slices/linkDetailSlice";
import useTranslation from "next-translate/useTranslation";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import StatusbarGeo from "../../components/Status/StatusBarGeo";
import Header from "../../components/Utilities/Header";
import LinkClose from "../../components/Static/LinkClose";
import Footer from "../../components/Utilities/Footer";

const DynamicLocation = dynamic(() => import("../../components/LocationView/LocationView"));

export default function Location() {
  const router = useRouter();
  const uuid = router.query.uuid || "";
  const dispatch = useDispatch();
  const { t } = useTranslation("common");
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
    if (queryExtension.isSuccess) {
      dispatch(setLinkDetail(data));
      if (data.status !== "expired") {
        dispatch(setUserActiveStatus("open"));
      }
    }
  }, [dispatch, queryExtension.isSuccess, queryExtension]);

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
          <Suspense fallback="Loading...">
            <DynamicLocation uuid={uuid} status={queryExtension.data.status} />
          </Suspense>
        ) : null}
      </main>
    </>
  );
}
