import { useRef } from "react";
import { motion } from "framer-motion";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import useTranslation from "next-translate/useTranslation";

export default function UploadComplete({ uploadProgress }) {
    const uploadCompleteRef = useRef(null);
    const { t } = useTranslation("common");

    useIsomorphicLayoutEffect(() => {
        if (uploadProgress === 100) {
            uploadCompleteRef.current.classList.replace("hidden", "flex");
        }
    }, [uploadProgress]);

    return (
        <motion.div
            className="hidden flex-1 justify-center items-center flex-col"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            ref={uploadCompleteRef}
        >
            <div className="flex flex-1 justify-center items-center space-x-3 h-52">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="30" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <div className="text-2xl text-white">{t("upload-complete")}</div>
            </div>
        </motion.div>
    );
}
