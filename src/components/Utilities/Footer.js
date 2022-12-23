import Image from "next/image";

export default function Footer() {
    return (
        <div className="fixed bg-slate-300 bottom-0 h-20 w-full flex flex-1 justify-center items-center">
            <Image
                className="w-[130px]"
                alt="nstda-logo"
                width={"auto"}
                height={"auto"}
                priority
                src={require("../../assets/img/footer/nstda-logo.png")}
            />
        </div>
    );
}
