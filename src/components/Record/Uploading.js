import { useEffect, useRef } from "react";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import UploadComplete from "./UploadComplete";
import useTranslation from "next-translate/useTranslation";
import { useSelector } from "react-redux";
import { updateUserActiveStatus } from "../../request";

export default function Uploading({ uploadProgress }) {
  const { uuid } = useSelector((state) => state.linkDetail);
  const uploadProgressRef = useRef(null);
  const { t } = useTranslation("common");

  useEffect(() => {
    const controller = new AbortController();
    updateUserActiveStatus({
      uuid: uuid,
      status: "upload",
      signal: controller.signal,
    }).then((r) => r);
    return () => controller.abort();
  }, [uuid]);

  useIsomorphicLayoutEffect(() => {
    if (uploadProgress > 0) {
      uploadProgressRef.current.classList.remove("hidden");
    }
    if (uploadProgress === 100) {
      uploadProgressRef.current.classList.add("hidden");
    }
  }, [uploadProgress]);

  return (
    <div className="flex flex-1 h-[calc(100vh-100px)] justify-center items-center bg-gray-800">
      <div
        className="radial-progress z-50 hidden"
        style={{
          color: "white",
          "--size": "14rem",
          "--thickness": "4px",
          "--value": uploadProgress,
          fontSize: "1.5rem",
        }}
        ref={uploadProgressRef}
      >
        <div className="text-2xl">{t("uploading") + " " + uploadProgress + "%"}</div>
      </div>
      <UploadComplete uploadProgress={uploadProgress} />
    </div>
  );
}
