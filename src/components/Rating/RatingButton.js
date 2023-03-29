import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function RatingButton({ rate, selectRate, setRate }) {
  return (
    <>
      <motion.button whileHover={{ scale: 1.3 }} onHoverStart={(e) => {}} onHoverEnd={(e) => {}} onClick={() => setRate(rate)}>
        {selectRate >= rate ? (
          <StarIcon style={{ fontSize: "60px", color: "green" }} />
        ) : (
          <StarBorderIcon style={{ fontSize: "60px", color: "green" }} />
        )}
      </motion.button>
    </>
  );
}
