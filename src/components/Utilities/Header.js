import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import ChangeLanguage from "./ChangeLanguage";

export default function Header() {
  const { t } = useTranslation("header");

  return (
    <div className="fixed flex flex-1 bg-secondary p-3 w-full justify-center items-center">
      <div className="m-2">
        <Image alt="HeadLogo" width={80} height={80} src={require("../../assets/img/header/logo.png")} />
      </div>
      <div className="flex justify-center flex-col">
        <div className="text-[16px] font-bold mx-2 text-primary-text">{t("header1")}</div>
        <div className="text-[15px] font-bold mx-2 text-primary-text">{t("header2")}</div>
      </div>
      <div className="fixed right-0 top-[24px]">
        <ChangeLanguage />
      </div>
    </div>
  );
}
