import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { GoLocation } from "react-icons/go";
import { savelocation } from '../../../actions/fetchAPI';
import './chat.css';

const ResponsiveChatPush = (props) => {
    var originClass;
    if (props.origin === 'local') {
        originClass = 'chat-item-right';
    } else {
        originClass = 'chat-item-left';
    }
    return (
        <div className="chat-row">
            <div className={originClass}>{props.message}</div>
            {/* <b>{props.sender}</b> {props.date} */}
        </div>
    )
}
const MessageRealTimeView = (props) => {
    if(props.messageRealtime !== ""){
        return (
            <div className="chat-row">
                <div className="chat-item-left">{props.messageRealtime}</div>
            </div>
        )
    }else{
        return (<div></div>)
    }
}

const Chat = (props) => {
    const messagedata = useSelector(state => state.messagedata)
    const registerData = useSelector(state => state.registerData);
    const messagesEndRef = useRef(null)
    const cursorRef = useRef(null);

    const [writeMessage, setWriteMessage] = useState("")
    const [sequenceNumber, setSequenceNumber] = useState(Math.floor((Math.random() * 100000) + 1));
    const [eventRtt, setEventRtt] = useState("new");

    const handleSendMessage = (event) => {
        if(event.key === "Enter"){
            registerData.userAgent.sendMessage(`sip:${registerData.callNumber}@${registerData.domain}`, event.target.value);
            setWriteMessage("")
            setSequenceNumber(Math.floor((Math.random() * 100000) + 1));
            setEventRtt("new");
        }
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
    const handleSendMessageButton = (event) => {
        registerData.userAgent.sendMessage(`sip:${registerData.callNumber}@${registerData.domain}`, writeMessage);
        setWriteMessage("")
        setSequenceNumber(Math.floor((Math.random() * 100000) + 1));
        setEventRtt("new");
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

    // useEffect(() => {
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));        
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));        
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "remote", dateTime.create().format('H:M:S'), "event.target.value"));
    //     dispatch(setMessagedata("local", "local", dateTime.create().format('H:M:S'), "event.target.value"));
    // },[dispatch])

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" })
    }
    useEffect(scrollToBottom, [messagedata]);

    return (
        <div className="shortcuts-phonekeypad" id="mySidenav">
            <div className="shortcuts conversation">
                <div className="vrs_map" id="xxx">
                    <div className="d-flex">
                        <div className="txt-vrs">สนทนาข้อความ</div>
                    </div>
                </div>
                <div className="chat-content">
                    <div className="chat-data" >
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
                        {props.messageRealtime === "" ? <span></span> : <MessageRealTimeView messageRealtime={props.messageRealtime}/>}
                        <div id="scrollbot" ref={messagesEndRef}></div>
                    </div>
                </div>
                <div  className="chat-send-message">
                    <GoLocation className="input-location-fullscreen" onClick={event => handleSendLocation()} />
                    <input 
                        className="input-message"
                        type="text" 
                        placeholder="พิมพ์ข้อความ"
                        ref={cursorRef}
                        onKeyDown={handleSendMessage} 
                        onChange={handleOnChange}
                        value={writeMessage} 
                    />
                    <input 
                        type="submit" value="ส่ง" 
                        className="input-sendmessage"
                        onClick={event => handleSendMessageButton()}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chat;