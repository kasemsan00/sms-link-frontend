import Header from "next/head";
import StatusbarGeo from "../Status/StatusBarGeo";
import Footer from "../Utilities/Footer";

export default function Error() {
  return (
    <>
      <StatusbarGeo show={true} />
      <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center"></div>
      <Footer />
    </>
  );
}
