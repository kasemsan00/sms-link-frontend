import { useState, useEffect, useRef, useTransition } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessageData } from "../../redux/slices/messageDataSlice";
import { reverseGeocode } from "../../request/request";
import StatusBarGeo from "../Status/StatusBarGeo";
import Input from "./Input";
import Content from "./Content";
import LongdooMap from "../Map/LongdooMap";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import StartChat from "./StartChat";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import Menu from "./Menu";
import { updateUserActiveStatus } from "../../request/request";
import { ConvertToRTTEvent } from "../Utilities/ConvertToRTTEvent";
import { DisplayBuffer } from "./realtime-text";

const ICRM_MAP_URL = process.env.NEXT_PUBLIC_ICRM_MAP_URL;

export default function Chat() {
  const dispatch = useDispatch();
  const chatRef = useRef(null);
  const modalRef = useRef(null);
  const { uuid, agent, domain } = useSelector((state) => state.linkDetail);
  const { userAgent } = useSelector((state) => state.sip);
  const [isDisplayMap, setIsDisplayMap] = useState(false);
  const [writeMessage, setWriteMessage] = useState("");
  const [location, setLocation] = useState();
  const [isStartChat, setIsStartChat] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [realtimeText, setRealtimeText] = useState("");
  useEffect(() => {
    const localFontSize = localStorage.getItem("fontSize");
    if (localFontSize) {
      setFontSize(parseInt(localFontSize));
    }
    if (localFontSize === null) {
      localStorage.setItem("fontSize", "14");
    }
  }, []);

  // useEffect(() => {
  //   const controller = new AbortController();
  // updateUserActiveStatus({
  //   uuid: uuid,
  //   status: "open",
  //   signal: controller.signal,
  // }).then((r) => r);
  //   return () => controller.abort();
  // }, [uuid]);

  const handleCloseModal = async () => {
    setIsDisplayMap(false);
    modalRef.current.classList.remove("modal-open");
    if (location !== undefined) {
      const res = await reverseGeocode({ lat: location?.lat, lon: location?.lon });
      res.geocode = res.geocode === undefined ? "" : res.geocode;
      res.district = res.district === undefined ? "" : res.district;
      res.province = res.province === undefined ? "" : res.province;
      res.subdistrict = res.subdistrict === undefined ? "" : res.subdistrict;
      res.road = res.road === undefined ? "" : res.road;
      let textLocation;
      if (res) {
        textLocation =
          location?.lat +
          ", " +
          location?.lon +
          " " +
          res.subdistrict +
          " " +
          res.district +
          " \n" +
          res.province +
          " " +
          res.country +
          " " +
          res.geocode +
          " " +
          res.road;
      } else {
        textLocation = location?.lat + ", " + location?.lon;
      }
      dispatch(
        addMessageData({ type: "local", body: "@URL:" + ICRM_MAP_URL + "/" + location?.lat + "/" + location?.lon, date: "" }),
      );
      dispatch(addMessageData({ type: "local", body: textLocation, date: "" }));
    }
  };

  useIsomorphicLayoutEffect(() => {
    if (isDisplayMap) {
      modalRef.current.classList.add("modal-open");
    }
  }, [isDisplayMap]);

  const handleStartChat = () => {
    setIsStartChat(true);
    updateUserActiveStatus({
      uuid: uuid,
      status: "chat",
      signal: undefined,
    }).then((r) => r);
    initialUserAgentCall();
  };

  const initialUserAgentCall = () => {
    const options = {
      mediaConstraints: { audio: true, video: false },
      sessionTimersExpires: 9999,
    };
    userAgent.call("sip:" + agent + "@" + domain, options);
    console.log("Initial UserAgent");
    const display = new DisplayBuffer((resp) => {
      if (resp.drained === true) {
        setRealtimeText(resp.text);
      }
    });
    userAgent.on("newMessage", async (event) => {
      if (event.originator === "remote" && !event.message._request.body.startsWith("@switch")) {
        if (event.message._request.body !== "") {
          const messageBody = event.message._request.body;
          if (!messageBody.startsWith("<rtt")) {
            display.commit();
            setRealtimeText("");
            dispatch(addMessageData({ type: "remote", body: messageBody, date: "" }));
          } else {
            const rttEvent = await ConvertToRTTEvent(messageBody);
            display.process(rttEvent);
          }
        }
      }
    });
  };

  return (
    <>
      <StatusBarGeo show={!isStartChat} uuid={uuid} />
      {!isStartChat ? null : <Menu fontSize={fontSize} setFontSize={setFontSize} />}
      {!isStartChat ? <Header /> : null}
      <StartChat isStartChat={isStartChat} handleStartChat={handleStartChat} />
      {!isStartChat ? <Footer /> : null}
      {!isStartChat ? null : (
        <>
          <div className="modal " ref={modalRef}>
            <div className="modal-box relative p-0">
              <label className="btn btn-sm btn-circle absolute right-2 top-2 z-50" onClick={handleCloseModal}>
                ✕
              </label>
              <div className="h-[500px]">
                <LongdooMap setLocation={setLocation} />
              </div>
            </div>
          </div>
          <div
            style={{ fontSize }}
            className="flex flex-1 justify-center items-center h-[calc(100vh-46px)] w-full bg-white"
            ref={chatRef}
          >
            <Input writeMessage={writeMessage} setWriteMessage={setWriteMessage} setIsDisplayMap={setIsDisplayMap} />
            <Content realtimeText={realtimeText} fontSize={fontSize} />
          </div>
        </>
      )}
    </>
  );
}
