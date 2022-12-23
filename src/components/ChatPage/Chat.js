import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessageData } from "../../redux/slices/messageDataSlice";
import { rerverseGeocoding } from "../../request";
import StatusBarGeo from "../Status/StatusBarGeo";
import Input from "./Input";
import Content from "./Content";
import LongdooMap from "../Map/LongdooMap";
import useIsomorphicLayoutEffect from "use-isomorphic-layout-effect";
import StartChat from "./StartChat";
import Header from "../Utilities/Header";
import Footer from "../Utilities/Footer";
import Menu from "./Menu";
import { updateUserActiveStatus } from "../../request";
import { ConvertToRTTEvent } from "../Utilities/ConvertToRTTEvent";
import { DisplayBuffer } from "./realtime-text";

export default function Chat() {
    const dispatch = useDispatch();
    const chatRef = useRef(null);
    const modalRef = useRef(null);
    const { uuid } = useSelector((state) => state.linkDetail);
    const { userAgent } = useSelector((state) => state.sip);
    const [isDisplayMap, setIsDisplayMap] = useState(false);
    const [writeMessage, setWriteMessage] = useState("");
    const [location, setLocation] = useState();
    const [isStartChat, setIsStartChat] = useState(false);
    const [textSize, setTextSize] = useState(14);
    const [realtimeText, setRealtimeText] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        updateUserActiveStatus({
            uuid: uuid,
            status: "open",
            signal: controller.signal,
        });
        return () => controller.abort();
    }, [uuid]);

    const handleCloseModal = async () => {
        setIsDisplayMap(false);
        modalRef.current.classList.remove("modal-open");
        if (location !== undefined) {
            const res = await rerverseGeocoding({ lat: location.lat, lon: location.lon });
            let textView = "";
            if (res) {
                textView =
                    "พิกัด " +
                    location.lat +
                    ", " +
                    location.lon +
                    " " +
                    res.subdistrict +
                    " " +
                    res.district +
                    " \n" +
                    res.province +
                    " " +
                    res.country +
                    " " +
                    res.geocode;
            } else {
                textView = "พิกัด " + location.lat + ", " + location.lon;
            }
            dispatch(addMessageData({ type: "local", body: textView, date: "" }));
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
        });
        initialUserAgentCall();
    };

    const initialUserAgentCall = () => {
        const options = {
            mediaConstraints: { audio: true, video: false },
            sessionTimersExpires: 9999,
        };
        console.log("userAgent Call", 1006);
        userAgent.call("sip:1006@sip-27.d1669.in.th", options);
        console.log("initial UA Message");
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
            <StatusBarGeo show={!isStartChat ? true : false} uuid={uuid} />
            {!isStartChat ? null : <Menu textSize={textSize} setTextSize={setTextSize} />}
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
                        style={{ fontSize: textSize }}
                        className="flex flex-1 justify-center items-center h-[calc(100vh-46px)] w-full bg-white"
                        ref={chatRef}
                    >
                        <Input writeMessage={writeMessage} setWriteMessage={setWriteMessage} setIsDisplayMap={setIsDisplayMap} />
                        <Content realtimeText={realtimeText} />
                    </div>
                </>
            )}
        </>
    );
}
