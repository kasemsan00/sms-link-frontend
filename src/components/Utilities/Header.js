import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import ChangeLanguage from "./ChangeLanguage";

export default function Header() {
  const { t } = useTranslation("header");

  return (
    <div className="fixed flex flex-1 bg-slate-300 p-3 w-full justify-center items-center">
      <div className="m-2">
        <Image alt="NIEMSlogo" width={60} height={60} src={require("../../assets/img/header/NIEMS-logo.png")} />
      </div>
      <div className="flex justify-center flex-col">
        <div className="head-niems">{t("header1")}</div>
        <div className="head-niems">{t("header2")}</div>
      </div>
      <div className="fixed right-0 top-[24px]">
        <ChangeLanguage />
      </div>
    </div>
  );
}
