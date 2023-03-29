import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import ChangeLanguage from "./ChangeLanguage";

export default function Header() {
  const { t } = useTranslation("header");
  return (
    <div
      className="fixed flex flex-1 bg-secondary w-full justify-center items-center p-3
      mobile:p-0
      mobileSE:p-0
      sm:p-0
      md:p-3
      lg:p-3
      xl:p-3
      2xl:p-3
      "
    >
      <div className="m-2 w-[80px] h-[80px]">
        <Image priority={true} alt="HeadLogo" width="auto" height="auto" src={require("../../assets/img/header/logo.png")} />
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
