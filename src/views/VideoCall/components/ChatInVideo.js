import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { GoLocation } from "react-icons/go";
import { savelocation } from '../../../actions/fetchAPI';
import { setControlVideo } from '../../../actions';

// const dateTime = require('node-datetime');

const ResponsiveChatPush = (props) => {
    var originClass;
    if (props.origin === 'local') {
        originClass = 'chat-item-right-mobile';
    } else {
        originClass = 'chat-item-left-mobile';
    }
    return (
        <div className="chat-row-mobile">
            <div className={originClass}>{props.message}</div>
            {/* <b>{props.sender}</b> {props.date} */}
        </div>
    )
}
const MessageRealTimeView = (props) => {
    if(props.messageRealtime !== ""){
        return (
            <div className="chat-row-mobile">
                <div className="chat-item-left-mobile">{props.messageRealtime}</div>
            </div>
        )
    }else{
        return (<div></div>)
    }
}

const ChatInVideo = (props) => {
    const dispatch = useDispatch();
    const messagedata = useSelector(state => state.messagedata)
    const controlVideo = useSelector(state => state.controlVideo)
    const registerData = useSelector(state => state.registerData);
    
    const messagesEndRef = useRef(null)

    const [writeMessage, setWriteMessage] = useState("")
    const [sequenceNumber, setSequenceNumber] = useState(Math.floor((Math.random() * 100000) + 1));
    const [eventRtt, setEventRtt] = useState("new");
    // const [iosDeviceStatus, setiOSDeviceStatus] = useState(null);

    const handleSendMessage = (event) => {
        if(event.key === "Enter"){
            registerData.userAgent.sendMessage(`sip:${registerData.callNumber}@${registerData.domain}`, event.target.value);
            setWriteMessage("")
            setSequenceNumber(Math.floor((Math.random() * 100000) + 1));
            setEventRtt("new");
        }
    }
    const handleSendMessageButton = (event) => {
        registerData.userAgent.sendMessage(`sip:${registerData.callNumber}@${registerData.domain}`, writeMessage);
        setWriteMessage("")
        setSequenceNumber(Math.floor((Math.random() * 100000) + 1));
        setEventRtt("new");
    }
    const handleOnChange = (event) => {
        setSequenceNumber(sequenceNumber+1);
        if(writeMessage !== ""){
            registerData.userAgent.sendMessage(
                `sip:${registerData.callNumber}@${registerData.domain}`, 
                `<rtt event='${eventRtt}' seq='${sequenceNumber}'><t>${event.target.value}</t></rtt>`
            );
            if(event === "new"){
                setEventRtt("reset")        
            }
        }
        if(event === "reset" && writeMessage === ""){
            registerData.userAgent.sendMessage(
                `sip:${registerData.callNumber}@${registerData.domain}`, 
                `<rtt event='${eventRtt}' seq='${sequenceNumber}'><t>${event.target.value}</t></rtt>`
            );
        }
        setWriteMessage(event.target.value)
    }
    const handleSendLocation = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            localStorage.setItem("accuracy", position.coords.accuracy);
            localStorage.setItem("lat", position.coords.latitude)
            localStorage.setItem("long", position.coords.longitude)
            savelocation({
                extension : registerData.extension,
                accuracy : position.coords.accuracy,
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            },() => {})
            registerData.userAgent.sendMessage(`sip:${registerData.callNumber}@${registerData.domain}`, `ส่งพิกัดเรียบร้อย (${position.coords.latitude}, ${position.coords.longitude})`);
        });
    }

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }
    useEffect(scrollToBottom, [messagedata]);
    
    useEffect(scrollToBottom, [controlVideo.show]);

    useEffect(() => {
        scrollToBottom();
    },[props.messageRealtime])

    useEffect(() => {
        scrollToBottom();
    },[props.iOSDevice])

    const handleFocus = () => {
        dispatch(setControlVideo("show", false));
        scrollToBottom()
    }
    const handleBlur = () => {
        dispatch(setControlVideo("show", true));
        scrollToBottom()
    }

    return (
        <div className="d-block d-lg-none call-message">
            <div  
                className={`chat-send-message-mobile ${controlVideo.openMessage? "":"hide"}`}
            >
                <GoLocation className="input-location" onClick={event => handleSendLocation()} />
                <input 
                    className="input-message"
                    type="text" 
                    placeholder="พิมพ์ข้อความ"
                    onKeyDown={handleSendMessage} 
                    onChange={handleOnChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={writeMessage} 
                />
                <input type="submit" value="ส่ง" className="input-sendmessage" onClick={event => handleSendMessageButton()}/>
            </div>
            <div className="message-conversation" id="slideMessage">
                <div 
                    className={`${props.iOSDevice === "iphone-control"? "chat-content-mobile-ios":"chat-content-mobile"}`}
                    // className="chat-content-mobile"
                >
                    <div className="chat-data-mobile" >
                        <span>
                        </span>
                        <div className="show_date_history">วันที่ 01/01/2019</div>
                        <div 
                            className={`${props.iOSDevice === "iphone-control"? "messages-mobile-ios":"messages-mobile"}`}
                            // className="messages-mobile"
                        >
                            {
                                messagedata.map ((chatdata, index) => {
                                    return (
                                        <ResponsiveChatPush
                                            key={index}
                                            sender=''
                                            origin={chatdata.origin}
                                            date={chatdata.date}
                                            message={chatdata.body}
                                        />
                                    )
                                })
                            }
                            <MessageRealTimeView messageRealtime={props.messageRealtime} />
                            <div id="scrollbot" ref={messagesEndRef}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatInVideo;