import { motion } from "framer-motion";
import Image from "next/image";

export default function SurveyButton({ rate, selectRate, setRate }) {
  return (
    <motion.button whileHover={{ scale: 1.3 }} onClick={() => setRate(rate)}>
      {selectRate >= rate ? (
        // <StarIcon style={{ fontSize: "60px", color: "green" }} />
        <Image src={require("../../assets/img/star-checked.png")} width={60} height={60} alt="start" />
      ) : (
        // <StarBorderIcon style={{ fontSize: "60px", color: "black" }} />
        <Image src={require("../../assets/img/star-uncheck.png")} width={60} height={60} alt="start" />
      )}
    </motion.button>
  );
}
