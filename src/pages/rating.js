import { useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useMutation } from "react-query";
import { submitRating } from "../request/request";
import StatusbarGeo from "../components/Status/StatusBarGeo";
import Header from "../components/Utilities/Header";
import Footer from "../components/Utilities/Footer";
import SurveyButton from "../components/Rating/RatingButton";

const uuid = "135bc1";

export default function Rating() {
  const { t } = useTranslation("common");
  const { t: tRate } = useTranslation("rating");
  const [selectRate, setSelectRate] = useState(null);
  const mutationSubmitRating = useMutation(submitRating);

  const handleClickSetRate = (value) => {
    setSelectRate(value);
  };
  const handleSubmitRate = () => {
    if (selectRate !== null) {
      mutationSubmitRating.mutate({ uuid: uuid, rate: selectRate });
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
        <div className="h-screen w-screen">
          <div
            className="w-full h-full flex flex-1 flex-col justify-center items-center"
            style={{ display: mutationSubmitRating.isSuccess ? "none" : "flex" }}
          >
            <div className="text-2xl font-bold text-primaryGreen mb-12">{tRate("rating-title")}</div>
            <div className="flex gap-2">
              <SurveyButton rate={1} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={2} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={3} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={4} selectRate={selectRate} setRate={handleClickSetRate} />
              <SurveyButton rate={5} selectRate={selectRate} setRate={handleClickSetRate} />
            </div>
            <button
              className="btn btn-warning mt-12 w-[50%] border-solid border-1 border-yellow-800 focus:border-solid focus:border-1 focus:border-yellow-800"
              onClick={handleSubmitRate}
            >
              {tRate("rating-submit")}
            </button>
          </div>
          <div
            className="w-full h-full flex flex-1 flex-col justify-center items-center"
            style={{ display: !mutationSubmitRating.isSuccess ? "none" : "flex" }}
          >
            <div className="text-3xl font-bold text-primaryGreen mb-12">{tRate("rating-success")}</div>
          </div>
        </div>
        {typeof window === undefined ? <Footer /> : null}
      </main>
    </>
  );
}
