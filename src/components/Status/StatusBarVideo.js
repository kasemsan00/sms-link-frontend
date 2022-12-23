import { useRef } from "react";
import Head from "next/head";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import { motion } from "framer-motion";
import StopWatch from "./Stopwatch";

const StatusBarVideo = ({ start, type, show }) => {
    const statusBarRef = useRef(null);

    useIsomorphicLayoutEffect(() => {
        if (type === "videorecord") {
            statusBarRef.current.classList.add("bg-red-800");
        }
    }, [type]);

    useIsomorphicLayoutEffect(() => {
        if (!show) {
            statusBarRef.current.classList.add("hidden");
        } else {
            statusBarRef.current.classList.remove("hidden");
        }
    }, [show]);

    return (
        <>
            <Head>{show ? <meta name="theme-color" content="#991B1B" /> : null}</Head>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed w-full z-50 flex flex-1 justify-center items-center h-[24px] bg-[#991B1B]"
                ref={statusBarRef}
            >
                <StopWatch start={start} />
            </motion.div>
        </>
    );
};
export default StatusBarVideo;
