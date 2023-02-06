import { useSelector } from "react-redux";
import StatusbarGeo from "../Status/StatusBarGeo";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import DeniedLocation from "./DeniedLocation";
import SendLocationSuccess from "./SendLocationSuccess";
import URLExpired from "./URLExpired";
import Loading from "./Loading";

const LocationView = ({ uuid, status }) => {
    const location = useSelector((state) => state.location);

    return (
        <>
            <StatusbarGeo show={true} uuid={uuid} />
            <Header />
            <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center">
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
