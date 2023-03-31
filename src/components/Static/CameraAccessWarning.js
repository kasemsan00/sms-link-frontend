import StatusbarGeo from "../Status/StatusBarGeo";
import Footer from "../Utilities/Footer";
import useTranslation from "next-translate/useTranslation";

export default function CameraAccessWarning() {
  const { t } = useTranslation("common");
  const handleClick = () => window.location.reload();
  return (
    <>
      <StatusbarGeo show={true} />
      <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center" onClick={handleClick}>
        <div className="text-2xl text-primaryGreen text-center font-bold p-[20px]">{t("please-allow-camera-access")}</div>
      </div>
      <Footer />
    </>
  );
}
