import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCallNumber } from "../redux/slices/linkDetailSlice";
import { setControlVideo } from "../redux/slices/controlVideoSlice";
import { DisplayBuffer } from "../components/ChatPage/realtime-text";
import { ConvertToRTTEvent } from "../components/Utilities/ConvertToRTTEvent";
import { setSession, resetSession } from "../redux/slices/sipSlice";
import { setWebStatus } from "../redux/slices/webStatusSlice";
import { setUserActiveStatus } from "../redux/slices/userActiveStatusSlice";
import { addMessageData } from "../redux/slices/messageDataSlice";
import { initConstraints } from "../components/VideoCall/function";
import adapter from "webrtc-adapter";

let constraints = initConstraints();

export default function useInitUserAgent({ localVideoRef, remoteVideoRef }) {
  const dispatch = useDispatch();

  const { userAgent, session } = useSelector((state) => state.sip);
  const { agent, domain } = useSelector((state) => state.linkDetail);

  const [connection, setConnection] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [startCall, setStartCall] = useState(false);
  const [realtimeText, setRealtimeText] = useState("");

  const userAgentCall = useCallback(
    ({ stream }) => {
      const display = new DisplayBuffer((resp) => {
        if (resp.drained === true) {
          setRealtimeText(resp.text);
        }
      });
      const eventHandlers = {
        peerconnection: (pc) => {
          setPeerConnection(pc);
        },
      };
      const options = {
        eventHandlers: eventHandlers,
        mediaStream: stream,
        pcConfig: [
          {
            urls: process.env.NEXT_PUBLIC_TURN_DOMAIN,
            username: process.env.NEXT_PUBLIC_TURN_USERNAME,
            credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
          },
        ],
        sessionTimersExpires: 9999,
      };
      console.log("userAgentCall", userAgent);
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
        if (session !== null) return;
        let newSession = ev1.session;
        dispatch(setSession(newSession));

        if (ev1.originator === "local") {
          newSession.connection.addEventListener("addstream", (event) => {
            dispatch(setUserActiveStatus("close"));
            setConnection(true);
            remoteVideoRef.current.srcObject = event.stream;
          });
        }
        newSession.on("connecting", () => {
          // dispatch(setUserActiveStatus("close"));
        });
        newSession.on("failed", (e) => {
          console.log("failed", e);
          alert(e.cause, e.message.reason_phrase);
        });
        newSession.on("ended", (e) => {
          console.log(e);
          setStartCall(null);
          dispatch(setWebStatus("ended"));
        });
        newSession.on("failed", () => {
          dispatch(setWebStatus(""));
          localVideoRef.current?.srcObject?.getTracks()?.forEach((track) => track.stop());
          remoteVideoRef.current?.srcObject?.getTracks()?.forEach((track) => track.stop());
        });
      });
      localVideoRef.current.srcObject = stream;
      userAgent.call("sip:" + agent + "@" + domain, options);
    },
    [dispatch, localVideoRef, remoteVideoRef, userAgent, agent, domain],
  );

  useEffect(() => {
    if (startCall !== null) {
      setStartCall(true);
    }
    if (startCall === true) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          userAgentCall({ stream });
        })
        .then((error) => {
          if (error) console.log(error);
        });
    }
    return () => {
      setStartCall(false);
    };
  }, [startCall, userAgent, userAgentCall]);

  return [realtimeText, connection, peerConnection, setStartCall];
}
