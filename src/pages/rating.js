import { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useMutation } from "react-query";
import { submitRating } from "../request/request";
import StatusbarGeo from "../components/Status/StatusBarGeo";
import Header from "../components/Utilities/Header";
import Footer from "../components/Utilities/Footer";

const SurveyButton = ({ rate, selectRate, setRate }) => {
  return (
    <>
      <button onClick={() => setRate(rate)}>
        {selectRate >= rate ? (
          <StarIcon style={{ fontSize: "50px", color: "green" }} />
        ) : (
          <StarBorderIcon style={{ fontSize: "50px", color: "green" }} />
        )}
      </button>
    </>
  );
};

const uuid = "135bc1";

export default function Rating() {
  const { t } = useTranslation("common");
  const [selectRate, setSelectRate] = useState(null);
  const mutationSubmitRating = useMutation(submitRating);

  const handleClickSetRate = (value) => {
    setSelectRate(value);
  };
  const handleSubmitRate = () => {
    if (selectRate !== null) {
      mutationSubmitRating.mutate(
        { uuid: uuid, rate: selectRate },
        {
          onSuccess: () => {
            console.log("submitSuccess");
          },
        },
      );
    }
  };
  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="theme-color" content="rgb(219 56 102)" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main>
        <StatusbarGeo show={true} uuid={uuid} />
        <Header />
        <div className="h-screen w-screen ">
          <div
            className="w-full h-full flex flex-1 flex-col justify-center items-center"
            style={{ display: mutationSubmitRating.isSuccess ? "none" : "flex" }}
          >
            <div className="text-3xl font-bold text-end mb-12">ประเมินความพึงพอใจ</div>
            <div className="flex gap-3">
              <SurveyButton rate={1} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={2} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={3} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={4} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={5} selectRate={selectRate} setRate={handleClickSetRate} />
            </div>
            <button className="btn btn-warning mt-12 w-[80%]" onClick={handleSubmitRate}>
              SubmitRate
            </button>
          </div>
          <div className="w-full h-full flex flex-1 flex-col justify-center items-center">Thank You</div>
        </div>
        {typeof window === undefined ? <Footer /> : null}
      </main>
    </>
  );
}
