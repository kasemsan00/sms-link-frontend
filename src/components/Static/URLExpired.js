import useTranslation from "next-translate/useTranslation";
import { motion } from "framer-motion";

export default function URLExpired() {
  const { t } = useTranslation("common");
  return (
    <motion.div
      className="flex flex-1 justify-center items-center flex-col"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-1 justify-center items-center">
        <div className="h-[200px] w-[200px] rounded-full shadow-md drop-shadow-md shadow-gray-700 bg-red-600 mb-5 text-center text-[130px] text-white">
          !
        </div>
      </div>
      <div className="flex flex-1 justify-center items-center flex-col space-x-3 w-46">
        <div className="text-2xl text-center">{t("url-expired")}</div>
      </div>
    </motion.div>
  );
}
