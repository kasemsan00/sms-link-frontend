const SurveyButton = ({ point }) => {
  return <button>{point}</button>;
};

export default function Survey() {
  return (
    <div className="h-screen w-screen flex flex-1 flex-col justify-center items-center">
      <div className="text-2xl">ประเมินความพึงพอใจ</div>
      <div>
        <SurveyButton point={1} />
      </div>
    </div>
  );
}
