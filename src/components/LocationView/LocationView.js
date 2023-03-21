import { useDispatch, useSelector } from "react-redux";
import StatusbarGeo from "../Status/StatusBarGeo";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import DeniedLocation from "./DeniedLocation";
import SendLocationSuccess from "./SendLocationSuccess";
import URLExpired from "../Static/URLExpired";
import Loading from "./Loading";
import { useEffect } from "react";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";

const LocationView = ({ uuid, status }) => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  useEffect(() => {
    dispatch(setUserActiveStatus("sendLocation"));
  }, [dispatch, uuid]);

  if (status === "expired") {
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
      <StatusbarGeo show={true} uuid={uuid} />
      <Header />
      <div className="flex flex-1 h-[calc(100vh-80px)] justify-center items-center landscape:mt-10">
        {status === "ERROR" ? <URLExpired /> : null}
        {status === "close" ? <URLExpired /> : null}
        {status !== "close" && status !== "ERROR" ? (
          <>
            {location.status === "Success" ? <SendLocationSuccess /> : <Loading />}
            {location.status === "User denied Geolocation" ? <DeniedLocation /> : null}
          </>
        ) : null}
      </div>
      <Footer />
    </>
  );
};
export default LocationView;
