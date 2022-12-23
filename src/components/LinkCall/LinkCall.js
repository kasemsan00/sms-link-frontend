import { useDispatch } from "react-redux";
import { setUserActiveStatus } from "../../redux/slices/userActiveStatusSlice";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import StatusbarGeo from "../Status/StatusBarGeo";
import Footer from "../Utilities/Footer";
import Header from "../Utilities/Header";
import { motion } from "framer-motion";
import useTranslation from "next-translate/useTranslation";

export const LinkCall = ({ uuid, extensionStatus }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const handleCall = () => {
        if (extensionStatus !== "close") {
            dispatch(setUserActiveStatus("makecall"));
            dispatch(setWebStatus("makecall"));
        }
    };

    return (
        <>
            <StatusbarGeo show={true} uuid={uuid} />
            <Header />
            <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center">
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                    <motion.div
                        className="bg-[#D13A2E] w-[30vh] h-[30vh] rounded-full shadow-md drop-shadow-md 
                                    shadow-gray-700 text-2xl text-white flex flex-1 justify-center items-center 
                                    text-center self-center cursor-pointer"
                        onClick={handleCall}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <div className="w-[140px]">{t("link-call")}</div>
                    </motion.div>
                </motion.div>
            </div>
            <Footer />
        </>
    );
};

export default LinkCall;
