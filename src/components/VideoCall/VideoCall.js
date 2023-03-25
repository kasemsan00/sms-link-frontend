import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { initConstraints } from "./Constraints";
import ControlVideo from "../VideoCall/ControlVideo";
import StatusBarVideo from "../Status/StatusBarVideo";
import VideoContent from "./VideoContent";
import ChatVideo from "./ChatVideo";
import useUserAgentCall from "../../hooks/useUserAgentCall";
import DisplayMap from "../Map/DisplayMap";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";

let constraints = initConstraints();

const MapModal = ({ displayMap, setDisplayMap }) => {
  const modalRef = useRef(null);
  useIsomorphicLayoutEffect(() => {
    if (displayMap.latitude !== 0 && displayMap.longitude !== 0) {
      modalRef.current.classList.add("modal-open");
    }
  }, [displayMap]);
  const handleCloseModal = () => {
    setDisplayMap({
      latitude: 0,
      longitude: 0,
    });
    modalRef.current.classList.remove("modal-open");
  };
  return (
    <div className="modal z-50 " ref={modalRef}>
      <div className="modal-box relative p-0">
        <label className="btn btn-sm btn-circle absolute right-2 top-2 z-50" onClick={handleCloseModal}>
          ✕
        </label>
        <div className="h-[500px]">
          <DisplayMap latitude={displayMap.latitude} longitude={displayMap.longitude} />
        </div>
      </div>
    </div>
  );
};

export default function VideoCall() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [displayMap, setDisplayMap] = useState({
    latitude: 0,
    longitude: 0,
  });
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
      <ChatVideo realtimeText={realtimeText} setDisplayMap={setDisplayMap} />
      <ControlVideo />
      <MapModal displayMap={displayMap} setDisplayMap={setDisplayMap} />
    </>
  );
}
