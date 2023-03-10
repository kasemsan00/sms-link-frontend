import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../Utilities/Footer";
import StatusBarGeo from "../Status/StatusBarGeo";
import StatusBarVideo from "../Status/StatusBarVideo";
import { useMutation } from "react-query";
import Recording from "./Recording";
import Uploading from "./Uploading";
import axios from "axios";
import Header from "../Utilities/Header";
import adapter from "webrtc-adapter";
import { isIOS, isDesktop, isSafari } from "react-device-detect";
import ControlPanel from "./ControlPanel";
import SelectCamera from "./SelectCamera";
import useTranslation from "next-translate/useTranslation";
// import { initRTC } from "./ReplaceableMediaStream";
import { updateUserActiveStatus, updateTerminateCall } from "../../request";
import StartCall from "../Utilities/StartCall";

// let temporaryStream = null;
let mediaRecorder = null,
  chunks = [];
let mediaConstraints = {
  audio: {
    autoGainControl: false,
    echoCancellation: true,
    noiseSuppression: true,
  },
  video: {
    width: 640,
    height: 480,
    frameRate: {
      max: 24,
      ideal: 24,
      min: 15,
    },
  },
};

export default function Record({ uuid }) {
  const { t } = useTranslation("common");

  const [isStartRecord, setIsStartRecord] = useState(false);
  const recordingRef = useRef(null);
  const localVideoRef = useRef(null);
  const startCameraRef = useRef(null);
  const controlPanelRef = useRef(null);
  const selectCameraRef = useRef(null);
  const startRecordRef = useRef(null);
  const backgroundRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraFacingMode, setCameraFacingMode] = useState("user");
  const [switchEnable, setSwitchEnable] = useState(null);
  const mutationUploadFile = useMutation(({ file }) => {
    const formData = new FormData();
    formData.append("files", file);
    axios
      .post(`${process.env.NEXT_PUBLIC_URL_API}/upload/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total)),
      })
      .then(({ data }) => {
        stopTrack();
        updateTerminateCall({ uuid }).then((r) => console.log(r));
        return data;
      });
  });

  // useEffect(() => {
  //   if (!isSafari && !isIOS && temporaryStream === null) {
  //     temporaryStream = new MediaStream();
  //     MediaStream.prototype.constructor = initRTC();
  //     MediaStream.prototype.replaceVideoTrack = function (track) {
  //       this.videoSender
  //         .replaceTrack(track)
  //         .then((r) => console.log(r))
  //         .catch((e) => console.log(e));
  //     };
  //     MediaStream.prototype.replaceAudioTrack = function (track) {
  //       this.audioSender
  //         .replaceTrack(track)
  //         .then((r) => console.log(r))
  //         .catch((e) => console.log(e));
  //     };
  //   }
  // }, [localVideoRef]);

  const initCameraStream = ({ facingMode }) => {
    // if (!isSafari && !isIOS) {
    //   localVideoRef.current.srcObject = temporaryStream.remoteStream;
    // }
    if (isDesktop) {
      mediaConstraints.video.facingMode = {};
    } else {
      mediaConstraints.video.facingMode = { exact: facingMode };
    }
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        backgroundRef.current.classList.add("bg-gray-800");
        // if (!isSafari && !isIOS) {
        //   window.stream = stream;
        //   localVideoRef.current.srcObject.replaceVideoTrack(stream.getVideoTracks()[0]);
        //   localVideoRef.current.srcObject.replaceAudioTrack(stream.getAudioTracks()[0]);
        // } else {
        localVideoRef.current.srcObject = stream;
        // }
        if (!isStartRecord) setIsStartRecord(true);
        setSwitchEnable("done");
        localVideoRef.current.classList.remove("hidden");
        setIsStartRecord(true);
        recorder();
      })
      .catch(errorGetUserMedia);
  };

  const switchCamera = (facingMode) => {
    mediaConstraints.video.facingMode = { exact: facingMode };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        if (localVideoRef.current.srcObject !== null) {
          window.stream = stream;
          localVideoRef.current.srcObject.replaceVideoTrack(stream.getVideoTracks()[0]);
          localVideoRef.current.srcObject.replaceAudioTrack(stream.getAudioTracks()[0]);
        }
        setSwitchEnable("done");
      })
      .then(errorGetUserMedia);
  };

  const errorGetUserMedia = (error) => {
    if (error !== undefined) {
      backgroundRef.current.classList.remove("bg-gray-800");
      setIsStartRecord(false);
      startRecordRef.current.classList.remove("hidden");
      startCameraRef.current.classList.remove("hidden");
      alert(error);
    }
  };

  const handleStartCamera = () => {
    startRecordRef.current.classList.add("hidden");
    startCameraRef.current.classList.add("hidden");
    // if (!isSafari && !isIOS) {
    //   initCameraStream({ facingMode: "user" });
    //   setIsStartRecord(true);
    // } else {
    // selectCameraRef.current.classList.add("modal-open");
    // }

    if (!isDesktop) {
      selectCameraRef.current.classList.add("modal-open");
    } else {
      initCameraStream({ facingMode: "user" });
    }
  };
  const handleStopRecord = () => {
    mediaRecorder.stop();
    recordingRef.current.classList.add("hidden");
    controlPanelRef.current.classList.add("hidden");
    // stop all stream
  };
  const handleSwitchCamera = () => {
    window.stream.getTracks().forEach((track) => {
      track.stop();
    });
    setSwitchEnable("switch");
    if (cameraFacingMode === "user") {
      setCameraFacingMode("environment");
      switchCamera("environment");
    } else {
      setCameraFacingMode("user");
      switchCamera("user");
    }
  };

  const recorder = () => {
    // if (!isIOS && !isSafari) {
    // mediaRecord({ stream: localVideoRef.current.captureStream() });
    // } else {
    mediaRecord({ stream: localVideoRef.current.srcObject });
    // }
    updateUserActiveStatus({
      uuid: uuid,
      status: "record",
    }).then((r) => console.log(r));
  };

  const getMimeType = () => {
    if (!isSafari && !isIOS) {
      return "video/webm";
    } else {
      return "video/mp4";
    }
  };
  const mediaRecord = ({ stream: stream }) => {
    const options = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 750000,
      mimeType: getMimeType(),
    };
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
    mediaRecorder.error = (error) => {
      console.log(error);
    };
    mediaRecorder.onstop = onStop;
    mediaRecorder.start();
  };

  const onStop = () => {
    console.log("onStopRecord");
    setUploadProgress(1);
    setIsStartRecord(false);
    updateUserActiveStatus({
      uuid: uuid,
      status: "close",
    }).then((r) => console.log(r));

    const blob = new Blob(chunks, {
      type: getMimeType(),
    });
    const fileExt = getMimeType() === "video/webm" ? "webm" : "mp4";
    const file = new File([blob], "file_record." + fileExt);
    mutationUploadFile.mutate({ file: file }),
      {
        onSuccess: () => {},
      };
  };
  const stopTrack = () => {
    if (localVideoRef.current.srcObject !== null) {
      localVideoRef.current.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
    }
    if (window.stream !== undefined) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const handleSelectCamera = (value) => {
    setIsStartRecord(true);
    initCameraStream({ facingMode: value !== "front" ? "environment" : "user" });
    selectCameraRef.current.classList.remove("modal-open");
  };

  return (
    <>
      <StatusBarGeo uuid={uuid} show={!isStartRecord} />
      <StatusBarVideo start={isStartRecord} type="videorecord" show={isStartRecord} />
      {!isStartRecord ? <Header /> : null}
      <div className="h-screen w-screen " ref={backgroundRef}>
        <div
          className="flex flex-1 h-[calc(100vh-85px)] justify-center items-center
        sm:h-[calc(100vh)]"
          ref={startRecordRef}
        >
          <StartCall startRef={startCameraRef} title={t("start-record")} handleClick={handleStartCamera} />
        </div>
        <SelectCamera selectCameraRef={selectCameraRef} handleSelectCamera={handleSelectCamera} />
        <Recording recordingRef={recordingRef} localVideoRef={localVideoRef} isStartRecord={isStartRecord} />
        {isStartRecord ? null : <Uploading uploadProgress={uploadProgress} />}
        {isStartRecord ? (
          <ControlPanel
            controlPanelRef={controlPanelRef}
            handleStopRecord={handleStopRecord}
            handleSwitchCamera={handleSwitchCamera}
            switchEnable={switchEnable}
          />
        ) : null}
      </div>
      {!isStartRecord ? <Footer /> : null}
    </>
  );
}
