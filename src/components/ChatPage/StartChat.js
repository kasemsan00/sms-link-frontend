import { useRef } from "react";
import useTranslation from "next-translate/useTranslation";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import StartCall from "../Utilities/StartCall";

export default function StartChat({ isStartChat, handleStartChat }) {
  const { t } = useTranslation("common");

  const startChatRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (isStartChat) {
      startChatRef.current.classList.add("hidden");
    } else {
      if (startChatRef.current.classList.contains("hidden")) {
        startChatRef.current.classList.remove("hidden");
      }
    }
  }, [isStartChat]);

  return (
    <div className="flex flex-1 h-[calc(100vh)] justify-center items-center" ref={startChatRef}>
      <StartCall startRef={null} title={t("start-chat")} handleClick={handleStartChat} />
    </div>
  );
}
