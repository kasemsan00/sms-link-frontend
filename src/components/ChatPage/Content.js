import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import MessageRight from "./MessageRight";
import MessageLeft from "./MessageLeft";

export default function Content({ realtimeText }) {
    const messageEndRef = useRef(null);
    const messageData = useSelector((state) => state.messageData);
    const realtimePreviewRef = useRef(null);

    const scrollToBottom = () => {
        messageEndRef.current.scrollIntoView({ behavior: "instant" });
    };
    useEffect(scrollToBottom, [messageData]);

    useIsomorphicLayoutEffect(() => {
        scrollToBottom();
    }, [messageData]);
    useIsomorphicLayoutEffect(() => {
        if (realtimeText === "") {
            realtimePreviewRef.current.classList.add("hidden");
        } else {
            realtimePreviewRef.current.classList.remove("hidden");
        }
        realtimePreviewRef.current.textContent = realtimeText;
    }, [realtimeText]);

    return (
        <motion.div
            className="fixed w-full pl-1 max-h-[calc(100vh-85px)] bottom-12 overflow-x-hidden overflow-y-scroll chat-scroll break-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {messageData.map((item, index) => {
                return (
                    <div key={index} className="w-full inline-block">
                        {item.type !== "local" ? <MessageLeft text={item.body} /> : <MessageRight text={item.body} />}
                    </div>
                );
            })}
            <div
                className="w-fit bg-gray-300 text-black px-2 py-1 rounded-xl right-0 text-left float-left shadow-sm drop-shadow-sm mb-[5px]"
                ref={realtimePreviewRef}
            ></div>
            <div ref={messageEndRef}></div>
        </motion.div>
    );
}
