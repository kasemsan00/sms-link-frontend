import { useEffect, useRef } from "react";
import { useState } from "react";
import { getLocationName, sendLocation } from "../../request";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../redux/slices/locationSlice";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
const { detect } = require("detect-browser");
const browser = detect();

const LoadingLocation = () => {
  return (
    <div className="loadingio-spinner-spinner-1yylj538kk5">
      <div className="ldio-lavc27z27c">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

const StatusbarGeo = ({ show }) => {
  const statusBarRef = useRef(null);
  const locationNameRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const uuid = router.query.uuid || "";
  const location = useSelector((state) => state.location);
  const [locationName, setLocationName] = useState();
  const [navigatorPosition, setNavigatorPosition] = useState();
  const { lang } = useTranslation("common");

  useQuery(
    [navigatorPosition],
    () =>
      sendLocation({
        os: browser.os,
        latitude: navigatorPosition.coords.latitude,
        longitude: navigatorPosition.coords.longitude,
        accuracy: navigatorPosition.coords.accuracy,
        uuid: uuid,
      }),
    {
      enabled: navigatorPosition !== undefined,
    },
  );

  useEffect(() => {
    const controller = new AbortController();
    if (uuid !== "" && locationName === undefined && navigator.geolocation && location.locationName === null) {
      navigator.geolocation.watchPosition(
        async (position) => {
          setNavigatorPosition(position);
          const response = await getLocationName({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            signal: controller.signal,
            language: lang,
          });
          if (response) {
            setLocationName(response.data.subdistrict + " " + response.data.district + " " + response.data.province);
            locationNameRef.current.innerHTML =
              response.data.subdistrict + " " + response.data.district + " " + response.data.province;
            dispatch(
              setLocation({
                status: "Success",
                locationName: response.data.subdistrict + " " + response.data.district + " " + response.data.province,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              }),
            );
          }
        },
        (error) => {
          console.log(error);
          dispatch(
            setLocation({
              status: error.message,
              locationName: "",
              latitude: "",
              longitude: "",
              accuracy: "",
            }),
          );
        },
      );
    } else {
      setLocationName(location.locationName);
      locationNameRef.current.innerHTML = location.locationName;
    }
    return () => controller.abort();
  }, [dispatch, uuid, locationName, location.locationName, lang]);

  useIsomorphicLayoutEffect(() => {
    if (!show) {
      statusBarRef.current.classList.add("hidden");
    } else {
      statusBarRef.current.classList.remove("hidden");
    }
  }, [show]);

  return (
    <>
      <Head>{show ? <meta name="theme-color" content="#2D683E" /> : null}</Head>
      <div className="flex flex-1 items-center justify-center h-[24px] bg-primary" ref={statusBarRef}>
        {locationName === undefined ? <LoadingLocation /> : null}
        <div className="text-white ml-1" ref={locationNameRef} />
      </div>
    </>
  );
};
export default StatusbarGeo;
