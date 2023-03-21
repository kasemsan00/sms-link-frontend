import useTranslation from "next-translate/useTranslation";

export default function LinkClose() {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-1 justify-center items-center space-x-3 h-52">
      <div className="flex flex-1 h-[calc(100vh-64px)] justify-center items-center landscape:mt-10">
        <div className="text-3xl text-primary font-bold">{t("link-close")}</div>
      </div>
    </div>
  );
}
