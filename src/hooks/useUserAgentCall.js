import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCallNumber } from "../redux/slices/linkDetailSlice";
import { setControlSwitchCamera, setControlVideo } from "../redux/slices/controlVideoSlice";
import { DisplayBuffer } from "../components/ChatPage/realtime-text";
import { ConvertToRTTEvent } from "../components/Utilities/ConvertToRTTEvent";
import { setSession } from "../redux/slices/sipSlice";
import { setWebStatus } from "../redux/slices/webStatusSlice";
import { addMessageData } from "../redux/slices/messageDataSlice";
import { initConstraints } from "../components/VideoCall/function";
// eslint-disable-next-line
import adapter from "webrtc-adapter";

let constraints = initConstraints();
let session = null;

export default function useInitUserAgent({ localVideoRef, remoteVideoRef }) {
  const dispatch = useDispatch();
  const { userAgent } = useSelector((state) => state.sip);
  const { agent, domain } = useSelector((state) => state.linkDetail);
  const [connection, setConnection] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [startCall, setStartCall] = useState(false);
  const [realtimeText, setRealtimeText] = useState("");

  const userAgentCall = useCallback(
    ({ stream }) => {
      const display = new DisplayBuffer((resp) => {
        if (resp.drained) setRealtimeText(resp.text);
      });
      const stopStream = () => {
        localVideoRef.current?.srcObject?.getTracks()?.forEach((track) => track.stop());
        remoteVideoRef.current?.srcObject?.getTracks()?.forEach((track) => track.stop());
      };
      const eventHandlers = {
        peerconnection: (pc) => {
          setPeerConnection(pc);
        },
      };
      const options = {
        eventHandlers: eventHandlers,
        mediaStream: stream,
        pcConfig: {
          iceServers: [
            {
              urls: process.env.NEXT_PUBLIC_TURN_DOMAIN,
              username: process.env.NEXT_PUBLIC_TURN_USERNAME,
              credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
            },
          ],
        },
        sessionTimersExpires: 9999,
      };
      if (session === null) {
        userAgent.on("newMessage", async (event) => {
          const messageBody = event.message._request.body;
          if (messageBody.startsWith("@MCU")) {
            setTimeout(() => {
              localVideoRef.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") track.enabled = false;
              });
            }, 4000);
            setTimeout(() => {
              localVideoRef.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") track.enabled = true;
              });
              dispatch(setControlVideo("typeAsteriskCall", "MCU"));
              setConnection(true);
            }, 5000);
            return null;
          }
          if (messageBody.startsWith("@switch")) {
            dispatch(setCallNumber({ agent: event.message._request.body.split("|")[1] }));
            return null;
          }
          if (messageBody !== "" && !messageBody.startsWith("<rtt")) {
            display.commit();
            setRealtimeText("");
            dispatch(addMessageData({ type: "remote", body: messageBody, date: "" }));
            return null;
          }
          const rttEvent = await ConvertToRTTEvent(messageBody);
          display.process(rttEvent);
        });
        userAgent.on("newRTCSession", (ev1) => {
          session = ev1.session;
          dispatch(setSession(session));
          if (ev1.originator === "local") {
            ev1.session.connection.addEventListener("addstream", (event) => {
              setConnection(true);
              remoteVideoRef.current.srcObject = event.stream;
            });
          }
          ev1.session.on("ended", (e) => {
            console.log(e);
            stopStream();
            setStartCall(null);
            dispatch(setWebStatus("ended"));
          });
          ev1.session.on("failed", (e) => {
            dispatch(setWebStatus(""));
            console.log("failed", e);
            stopStream();
            alert(e.cause, e.message.reason_phrase);
          });
        });
      }
      localVideoRef.current.srcObject = stream;
      userAgent.call(`sip:${agent}@${domain}`, options);
    },
    [dispatch, localVideoRef, remoteVideoRef, userAgent, agent, domain],
  );
  useEffect(() => {
    if (startCall !== null) {
      setStartCall(true);
    }
    if (startCall === true) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          userAgentCall({ stream });
          if (constraints.video.facingMode === "user") {
            dispatch(setControlSwitchCamera("facingMode", "user"));
          }
        } catch (error) {
          console.log("error", error);
          if (error.name === "OverconstrainedError" && error.constraint === "facingMode") {
            constraints.video.facingMode = "user";
            setStartCall(false);
          }
        }
      })();
    }
    return () => {
      setStartCall(false);
    };
  }, [dispatch, startCall, userAgent, userAgentCall]);

  return [realtimeText, connection, peerConnection, setStartCall];
}
