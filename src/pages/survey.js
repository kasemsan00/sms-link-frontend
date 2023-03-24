import { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const SurveyButton = ({ point, setRate }) => {
  return (
    <>
      <button onClick={() => setRate(point)}>
        <StarOutlineIcon style={{ fontSize: "50px", color: "orange" }} />
      </button>
    </>
  );
};

export default function Survey() {
  const { t } = useTranslation("common");
  const [selectRate, setSelectRate] = useState(null);
  useEffect(() => {
    console.log(selectRate);
  }, [selectRate]);
  const handleClickSetRate = (value) => {
    setSelectRate(value);
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
        <div className="h-screen w-screen flex flex-1 flex-col justify-center items-center">
          <div className="text-3xl font-bold text-end mb-8">ประเมินความพึงพอใจ</div>
          <div className="flex gap-4">
            <SurveyButton rate={1} selectRate={selectRate} setRate={handleClickSetRate} />
            <SurveyButton rate={2} selectRate={selectRate} setRate={handleClickSetRate} />
            <SurveyButton rate={3} selectRate={selectRate} setRate={handleClickSetRate} />
            <SurveyButton rate={4} selectRate={selectRate} setRate={handleClickSetRate} />
            <SurveyButton rate={5} selectRate={selectRate} setRate={handleClickSetRate} />
          </div>
        </div>
      </main>
    </>
  );
}
