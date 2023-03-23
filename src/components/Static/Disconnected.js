import useTranslation from "next-translate/useTranslation";

export default function Disconnected() {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] justify-center items-center landscape:mt-10">
      <div className="text-3xl text-end font-bold">{t("extension-disconnected")}</div>
    </div>
  );
}
