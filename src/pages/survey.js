import { useState } from "react";
// import Footer from "../components/Utilities/Footer";
// import StatusbarGeo from "../components/Status/StatusBarGeo";

const SurveyButton = ({ point, handleClickSetPoint }) => {
  return <button onClick={() => handleClickSetPoint(point)}>{point}</button>;
};

export default function Survey() {
  const [point, setPoint] = useState(null);
  const handleClickSetPoint = (value) => {
    setPoint(value);
  };
  return (
    <div className="h-screen w-screen flex flex-1 flex-col justify-center items-center">
      {/*<StatusbarGeo show={true} uuid={"SSS"} />*/}
      <div className="text-2xl">ประเมินความพึงพอใจ</div>
      <div className="flex gap-4">
        <SurveyButton point={1} handleClickSetPoint={handleClickSetPoint} />
        <SurveyButton point={2} handleClickSetPoint={handleClickSetPoint} />
        <SurveyButton point={3} handleClickSetPoint={handleClickSetPoint} />
        <SurveyButton point={4} handleClickSetPoint={handleClickSetPoint} />
        <SurveyButton point={5} handleClickSetPoint={handleClickSetPoint} />
      </div>
      {/*<Footer />*/}
    </div>
  );
}
