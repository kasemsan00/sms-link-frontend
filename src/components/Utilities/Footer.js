import Image from "next/image";

export default function Footer() {
  return (
    <div className={"fixed bg-secondary bottom-0 h-16 w-full flex flex-1 justify-center items-center"}>
      <label className={"mr-2 text-[13px] text-nstda-color font-bold"}>Power By</label>
      <Image
        className="w-[70px]"
        alt="footer-logo"
        // width={"auto"}
        // height={"auto"}
        priority
        src={require("../../assets/img/footer/logo.png")}
      />
    </div>
  );
}
