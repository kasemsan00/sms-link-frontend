import RatingButton from "./RatingButton";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import { useMutation } from "react-query";
import { submitRating } from "../../request/request";

export default function Rating({ uuid }) {
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
      <div
        className="w-full h-full flex flex-1 flex-col justify-center items-center"
        style={{ display: mutationSubmitRating.isSuccess ? "none" : "flex" }}
      >
        <div className="text-3xl font-bold text-end mb-12">{tRate("rating-title")}</div>
        <div className="flex gap-2">
          <RatingButton rate={1} selectRate={selectRate} setRate={handleClickSetRate} />
          <RatingButton rate={2} selectRate={selectRate} setRate={handleClickSetRate} />
          <RatingButton rate={3} selectRate={selectRate} setRate={handleClickSetRate} />
          <RatingButton rate={4} selectRate={selectRate} setRate={handleClickSetRate} />
          <RatingButton rate={5} selectRate={selectRate} setRate={handleClickSetRate} />
        </div>
        <button className="btn btn-warning mt-12 w-[50%]" onClick={handleSubmitRate}>
          {tRate("rating-submit")}
        </button>
      </div>
      <div
        className="w-full h-full flex flex-1 flex-col justify-center items-center"
        style={{ display: !mutationSubmitRating.isSuccess ? "none" : "flex" }}
      >
        <div className="text-3xl font-bold text-end mb-12">{tRate("rating-success")}</div>
      </div>
    </>
  );
}
