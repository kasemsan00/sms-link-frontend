import { useEffect, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { initConstraints } from "./function";
import ControlVideo from "../VideoCall/ControlVideo";
import StatusBarVideo from "../Status/StatusBarVideo";
import VideoContent from "./VideoContent";
import ChatVideo from "../ChatVideo";
import useUserAgentCall from "../../hooks/useUserAgentCall";

let constraints = initConstraints();

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { userAgent } = useSelector((state) => state.sip);
  const controlVideo = useSelector((state) => state.controlVideo);
  const [realtimeText, connection, peerConnection, setStartCall] = useUserAgentCall({ localVideoRef, remoteVideoRef });

  useEffect(() => {
    setStartCall(true);
  }, [setStartCall]);

  useLayoutEffect(() => {
    if (remoteVideoRef !== null) {
      remoteVideoRef.current.muted = controlVideo.openAudio;
    }
  }, [controlVideo.openAudio, remoteVideoRef]);

  useEffect(() => {
    if (controlVideo.facingMode !== "") {
      localVideoRef.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });

      // console.log("constraints", constraints);
      // console.log(controlVideo);
      // console.log(constraints.video);
      // console.log(constraints.video.faceingMode.exact);
      constraints.video.faceingMode.exact = controlVideo.facingMode;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          peerConnection.peerconnection.getSenders().map(function (sender) {
            sender
              .replaceTrack(
                stream.getTracks().find(function (track) {
                  return track.kind === sender.track.kind;
                }),
              )
              .then((r) => console.log(r))
              .catch((e) => console.log(e));
          });
        })
        .catch((e) => console.error(e));
    }
  }, [controlVideo.facingMode, peerConnection]);

  return (
    <>
      <StatusBarVideo show={true} start={connection} />
      <VideoContent localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
      <ChatVideo realtimeText={realtimeText} />
      <ControlVideo />
    </>
  );
}
