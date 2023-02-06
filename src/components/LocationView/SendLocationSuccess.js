import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

export default function SendLocationSuccess() {
    const { t } = useTranslation("common");
    return (
        <motion.div
            className="flex flex-1 justify-center items-center flex-col"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Image priority width={200} height={200} alt="placelocation" src={require("../../assets/img/placeholder.png")} />
            <div className="flex flex-1 justify-center items-center space-x-3 h-52">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <div className="text-2xl">{t("send-location-success")}</div>
            </div>
        </motion.div>
    );
}
