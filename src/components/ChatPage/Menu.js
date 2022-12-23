import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import { motion } from "framer-motion";
import { setWebStatus } from "../../redux/slices/webStatusSlice";
import { useMutation } from "react-query";
import { updateTerminateCall, updateUserActiveStatus } from "../../request";
import { useDispatch, useSelector } from "react-redux";

export default function Menu({ textSize, setTextSize }) {
    const dispatch = useDispatch();
    const uuid = useSelector((state) => state.linkDetail.uuid);
    const mutationTerminate = useMutation(updateTerminateCall);

    const textDecrease = () => setTextSize(textSize - 1);
    const textIncrease = () => setTextSize(textSize + 1);
    const exitChat = () => {
        mutationTerminate.mutate(
            { uuid },
            {
                onSuccess: async () => dispatch(setWebStatus("ended")),
            },
        );
        updateUserActiveStatus({
            uuid: uuid,
            status: "close",
            signal: undefined,
        });
    };

    return (
        <motion.div
            className="fixed flex flex-1 justify-center items-center top-0 z-50 bg-blue-300 w-full h-[50px] shadow-sm drop-shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="fixed flex flex-1 justify-center left-0 pl-1">
                <div className="mx-1 flex flex-1 items-center cursor-pointer" onClick={textIncrease}>
                    <TextIncreaseIcon color="primary" fontSize="large" />
                </div>
                <div className="mx-1 flex flex-1 items-center cursor-pointer" onClick={textDecrease}>
                    <TextDecreaseIcon color="primary" fontSize="large" />
                </div>
            </div>
            <div className="fixed flex flex-1 justify-center">
                <div className="mx-1">
                    <SupportAgentIcon color="primary" fontSize="large" />
                </div>
                <div className="mx-1 flex flex-1 items-center text-xl font-medium text-[#1976d2]">D1422</div>
            </div>
            <div className="fixed right-0 pr-1 cursor-pointer" onClick={exitChat}>
                <ExitToAppIcon color="primary" fontSize="large" />
            </div>
        </motion.div>
    );
}
