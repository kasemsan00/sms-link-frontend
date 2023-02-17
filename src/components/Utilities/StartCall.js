import { motion } from "framer-motion";

export default function StartCall({ startRef, title, handleClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      ref={startRef}
    >
      <motion.div
        className="bg-[#D13A2E] w-[30vh] h-[30vh] rounded-full shadow-md drop-shadow-md
              shadow-gray-700 text-2xl text-white flex flex-1 justify-center items-center
              text-center self-center cursor-pointer
              landscape:w-[40vh]
              landscape:h-[40vh]
              "
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div
          className="w-[140px] font-bold
            mobile:text-xl
            mobileSE:text-xl
            sm:text-xl
            md:text-2xl
            lg:text-2xl
            xl:text-2xl
            "
        >
          {title}
        </div>
      </motion.div>
    </motion.div>
  );
}
