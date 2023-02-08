import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

export default function ChangeLanguage() {
  const router = useRouter();
  const { lang } = useTranslation("header");
  const handleSetLanguage = (lang) => {
    window.location.href = "/" + lang + "/" + router.asPath;
  };

  return (
    <div className="dropdown dropdown-bottom dropdown-end mr-[8px] mt-[5px] h-[25px]">
      <label tabIndex="0" className="cursor-pointer rounded-btn focus:none">
        <Image src={require(`../../assets/img/language/${lang}.png`)} width={25} height={25} alt="thai" />
      </label>
      <ul tabIndex="0" className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-28">
        <li onClick={() => handleSetLanguage("th")}>
          <div>
            <div>
              <Image src={require("../../assets/img/language/th.png")} width={25} height={25} alt="thai" />
            </div>
            <div className="block">TH</div>
          </div>
        </li>
        <li onClick={() => handleSetLanguage("en")}>
          <div>
            <div className="block">
              <Image src={require("../../assets/img/language/en.png")} width={25} height={25} alt="thai" />
            </div>
            <div className="block">EN</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
