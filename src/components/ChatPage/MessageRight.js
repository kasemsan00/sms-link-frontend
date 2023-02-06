import { motion } from "framer-motion";

export default function MessageRight({ text }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-fit bg-chat-user-local text-white px-2 py-1 rounded-xl right-0 text-right float-right shadow-sm drop-shadow-sm"
        >
            {text}
        </motion.div>
    );
}
