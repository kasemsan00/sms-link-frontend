import { useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { initConstraints } from "./Constraints";
import ControlVideo from "../VideoCall/ControlVideo";
import StatusBarVideo from "../Status/StatusBarVideo";
import VideoContent from "./VideoContent";
import ChatVideo from "./ChatVideo";
import useUserAgentCall from "../../hooks/useUserAgentCall";

let constraints = initConstraints();

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const { openAudio, facingMode } = useSelector((state) => state.controlVideo);
  const [realtimeText, connection, peerConnection, setStartCall] = useUserAgentCall({ localVideoRef, remoteVideoRef });

  useEffect(() => {
    setStartCall(true);
  }, [setStartCall]);

  useLayoutEffect(() => {
    if (remoteVideoRef !== null) {
      remoteVideoRef.current.muted = openAudio;
    }
  }, [openAudio, remoteVideoRef]);

  useEffect(() => {
    if (facingMode !== "") {
      localVideoRef.current.srcObject.getTracks().forEach(function (track) {
        track.stop();
      });
      constraints.video.facingMode.exact = facingMode;
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(stream, constraints);
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
        .catch((e) => {
          console.log("Error", e);
        });
    }
  }, [facingMode, peerConnection]);

  return (
    <>
      <StatusBarVideo show={true} start={connection} />
      <VideoContent localVideoRef={localVideoRef} remoteVideoRef={remoteVideoRef} />
      <ChatVideo realtimeText={realtimeText} />
      <ControlVideo />
    </>
  );
}
