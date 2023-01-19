import { motion } from "framer-motion";

export default function MessageLeft({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-fit bg-gray-200 px-2 py-1 rounded-xl left-0 text-left float-left shadow-sm drop-shadow-sm"
    >
      {text}
    </motion.div>
  );
}
