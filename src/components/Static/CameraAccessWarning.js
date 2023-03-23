import StatusbarGeo from "../Status/StatusBarGeo";
import Footer from "../Utilities/Footer";
import useTranslation from "next-translate/useTranslation";

export default function CameraAccessWarning() {
  const { t } = useTranslation("common");
  const handleClick = (e) => {
    window.location.reload();
  };
  return (
    <>
      <StatusbarGeo show={true} />
      <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center" onClick={handleClick}>
        <div className="text-3xl text-end text-center font-bold">{t("please-allow-camera-access")}</div>
      </div>
      <Footer />
    </>
  );
}
