import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCallNumber } from "../redux/slices/linkDetailSlice";
import { setControlVideo } from "../redux/slices/controlVideoSlice";
import { DisplayBuffer } from "../components/ChatPage/realtime-text";
import { ConvertToRTTEvent } from "../components/Utilities/ConvertToRTTEvent";
import { setSession } from "../redux/slices/sipSlice";
import { setWebStatus } from "../redux/slices/webStatusSlice";
import { addMessageData } from "../redux/slices/messageDataSlice";
import { initConstraints } from "../components/VideoCall/Constraints";
// eslint-disable-next-line
import adapter from "webrtc-adapter";
let display = null;
let constraints = initConstraints();
let session = null;
let type = "remote";

export default function useInitUserAgent({ localVideoRef, remoteVideoRef }) {
  const dispatch = useDispatch(),
    { userAgent } = useSelector((state) => state.sip),
    { agent, domain, sms_code } = useSelector((state) => state.linkDetail),
    [connection, setConnection] = useState(false),
    [peerConnection, setPeerConnection] = useState(null),
    [startCall, setStartCall] = useState(false),
    [realtimeText, setRealtimeText] = useState({
      type: "",
      body: "",
    }),
    userAgentCall = useCallback(
      ({ stream }) => {
        display = new DisplayBuffer((resp) => {
          if (resp.drained) {
            setRealtimeText({
              type: type,
              body: resp.text,
            });
          }
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
            const { _request } = event.message;
            const messageBody = _request.body;
            if (userAgent.configuration.uri.user === _request.from.uri.user) {
              type = "local";
            } else {
              type = "remote";
            }
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
              return;
            }
            if (messageBody.startsWith("@switch")) {
              dispatch(setCallNumber({ agent: _request.body.split("|")[1] }));
              if (sms_code !== "") {
                setTimeout(() => {
                  userAgent.sendMessage(`sip:${agent}@${domain}`, "@SMS:" + sms_code);
                }, 3000);
              }
              return;
            }
            if (messageBody !== "" && !messageBody.startsWith("<rtt")) {
              if (messageBody.startsWith("@SMS:")) return;
              display.commit();
              setRealtimeText("");
              dispatch(addMessageData({ type, body: messageBody, date: "" }));
              return;
            }
            if (type === "remote") {
              const rttEvent = await ConvertToRTTEvent(messageBody);
              display.process(rttEvent);
            }
          });
          userAgent.on("newRTCSession", (ev1) => {
            session = ev1.session;
            dispatch(setSession(session));
            if (ev1.originator === "local") {
              ev1.session.connection.addEventListener("addstream", (event) => {
                const { stream } = event;
                setConnection(true);
                remoteVideoRef.current.srcObject = stream;
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
      [localVideoRef, userAgent, agent, domain, sms_code, remoteVideoRef, dispatch],
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
        } catch (error) {
          console.log("error", error);
          if (error + "".includes("NotAllowedError")) {
            dispatch(setWebStatus("CameraNotAllow"));
          }
          if (error.name === "OverconstrainedError") {
            if (error.message === "Constraints could be not satisfied") {
              return null;
            }
            if (error.constraint === "facingMode") {
              constraints.video.facingMode = "user";
              setStartCall(false);
              return null;
            }
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
