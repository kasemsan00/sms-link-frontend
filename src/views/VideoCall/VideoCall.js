import React, {useState, useEffect} from 'react';
import ControlVideo from './components/ControlVideo';
import { useDispatch, useSelector } from 'react-redux';
import Chat from './components/Chat';
import ChatInVideo from './components/ChatInVideo';
import ControlVideo2 from './components/ControlVideo2';
import VideoStopwatch from './components/VideoStopwatch';
import Statusbar from '../../components/Statusbar';
import { setMessagedata, setRegisterData, setWebStatus, setControlVideo } from '../../actions';
// eslint-disable-next-line react-hooks/exhaustive-deps
import adapter from 'webrtc-adapter';

const { detect } = require('detect-browser');
const async      = require('async');
const browser    = detect();

const dateTime = require('node-datetime');
const convert = require('xml-js');
const matchMedia = window.matchMedia("(max-width: 768px)");

var constraints = { 
    audio: true, 
    video: {
        frameRate : {
            min: "15 ",
            max: "15"
        },
        width: {
            min: "352 ",
            max: "352 "
        },
        height: {
            min: "240",
            max: "240"
        },    
    },
    optional: [ { facingMode: "user" }]
};

var localVideo, remoteVideo;

const VideoCall = () => {

    const [msgRealtime, setMsgRealtime] = useState("")
    const [msgRealtimeRaw, setMsgRealtimeRaw] = useState("")
    const [chooseCamera, setChooseCamera] = useState(false);
    const [peerconnection, setPeerconnection] = useState(null);
    const [connection, setConnection] = useState(false);
    const [showLocalVideo, setShowLocalVideo] = useState(false);
    const [iOSDevice, setiOSDevice] = useState("");
    const controlVideo = useSelector(state => state.controlVideo);
    const registerData = useSelector(state => state.registerData);
    const webStatus    = useSelector(state => state.webStatus);
    // const selectDeviceLabel = useSelector(state => state.chooseCamera);
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.style.backgroundColor = "#0F3548";
        localVideo  = document.getElementById("local-video");
        remoteVideo = document.getElementById("remote-video"); 
        if(webStatus === "vrsReceivingCall"){
            receivingCall();
        }else{
            makeCall();
            // checkIceTurn(3000, function(resolve, reject) {
            //    testTurnStun();
            // }).then((result) => {
            //     // console.log("then")
            //     makeCall(true);
            // })
            // .catch((e) => {
            //     // console.log("error")
            //     makeCall(false);
            // })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(()=>{
        if (matchMedia.matches) {
            if(controlVideo.openMessage){
                document.getElementById("slideMessage").style.display = "block";
                document.getElementById("img_vdocall").classList.add('vdo_call_show');
                document.getElementById("call-mobile").classList.add("call-mobile");
                document.getElementById("waiting_mobile").classList.add("waiting_mobile");
            }else{
                // alert("HE")
                document.getElementById("slideMessage").style.display = "none";
                document.getElementById("img_vdocall").classList.remove('vdo_call_show');
                document.getElementById("call-mobile").classList.remove("call-mobile");
                // document.getElementById("waiting_mobile").classList.remove("waiting_mobile");
            }
        }else{
            if(controlVideo.openMessage){
                document.getElementById("mySidenav").style.width = "30%";
                document.getElementById("xxx").style.display = "block";
                document.getElementById("main").style.marginRight = "30%";
            }else{
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("xxx").style.display = "none";
                document.getElementById("main").style.marginRight = "0";
            }
        }
    },[controlVideo.openMessage, connection])

    useEffect(() => {
        if(controlVideo.show === false){
            if (browser.os === 'iOS'){
                setiOSDevice('iphone-control');
                document.getElementById("img_vdocall").classList.add('vdo_call_show');
            }else{
                setiOSDevice("");
            }
        }else{
            setiOSDevice("");
        }
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },[controlVideo.show])
    
    useEffect(() => {
        dispatch(setControlVideo("openMessage", true));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[controlVideo.show])

    // const isIpadOS = () => {
    //     return navigator.maxTouchPoints &&
    //       navigator.maxTouchPoints > 2 &&
    //       /MacIntel/.test(navigator.platform);
    // }

    useEffect(() => {
        if(connection === true && registerData.callNumber !== "9999") {
            localVideo.srcObject.getTracks().forEach(function(track){
                if(track.kind === "video"){ track.enabled = false; }
            }); 
            setShowLocalVideo(false);
        }
        if(connection === true && registerData.callNumber === "9999") {
            setShowLocalVideo(true);
        }
    },[connection, registerData.callNumber])
    useEffect(()=>{
        if(connection){
            localVideo.srcObject.getTracks().forEach(function(track){
                if(track.kind === "video"){ track.enabled = controlVideo.openVideo;  }
            }); 
        }
    },[controlVideo.openVideo, connection])

    useEffect(()=>{
        if(connection){
            localVideo.srcObject.getTracks().forEach(function(track){
                if(track.kind === "audio"){ 
                    track.enabled = controlVideo.openMic;  
                }
            });
        }
    },[controlVideo.openMic, connection])
    
    useEffect(()=>{
        if(connection){
            remoteVideo.srcObject.getTracks().forEach(function(track){
                // console.log(track)
                if(track.kind === "audio"){ 
                    track.enabled = controlVideo.openAudio;  
                }
            });
        }
    },[controlVideo.openAudio, connection])

    useEffect(()=>{
        if(controlVideo.openTerminate){

            if(connection){

                localVideo.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                });
                localVideo.srcObject = null;
                remoteVideo.srcObject.getTracks().forEach(function(track) {
                    track.stop();
                });
                remoteVideo.srcObject = null;
                peerconnection.terminate();
                registerData.userAgent.unregister();
                dispatch(setWebStatus("dialpad"));
                
                dispatch(setRegisterData("userAgent", null));
                dispatch(setControlVideo("openTerminate", false))
                
            }else{
                registerData.userAgent.stop();
                dispatch(setWebStatus("dialpad"));
                dispatch(setControlVideo("openTerminate", false))
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[controlVideo.openTerminate])

    const receivingCall = () =>{

        var callOptions = {
            "mediaConstraints": {
                audio : true,
                video : true
            },
            // 'pcConfig' : {
                // 'rtcpMuxPolicy': 'negotiate',
                // 'iceServers': [  
                //     { 
                //         'urls': "turns:numb.viagenie.ca", 
                //         'username': "dweton@gmail.com",
                //         'credential': "themummy" 
                //     }
                    // {
                        // 'urls' : "stun:stun01.sipphone.com"
                    // }
                // ]
            // },
            // 'rtcOfferConstraints' : {'IceRestart' : true},
            // 'sessionTimersExpires' : false
        };

        // console.log(registerData.session);
        registerData.session.answer(callOptions);
        registerData.session.on('answer', () =>{console.log("answer")});
        registerData.session.on('ended', () => {
            console.log("ended");
        });
        registerData.session.on('failed', (e) => {
            console.log("failed", e)
            dispatch(setWebStatus("dialpad"))
            registerData.userAgent.unregister();
        });
        registerData.session.on('accepted', () => {console.log("accepted");});
        registerData.session.on("confirmed",function(){
            // localVideo.srcObject  = registerData.session.connection.getLocalStreams()[0];
            // remoteVideo.srcObject = registerData.session.connection.getRemoteStreams()[0];
            setPeerconnection(registerData.session);
            setConnection(true);
        });
    }
    // const testTurnStun = () => {
    //     const offerOptions = {offerToReceiveAudio: 1};
    //     const config = {
    //         "iceServers" : [{ 
    //             'urls': "turn:turn2.im9.co", 
    //             'username': "turn01", 
    //             'credential': "Test1234",
    //         }],
    //         "bundlePolicy" : "max-compat",
    //         "iceTransportPolicy":"all",
    //     }
    //     pcTEST = new RTCPeerConnection(config);
    //     pcTEST.onicecandidate = (event) => {
    //         if (event.candidate) {
    //             if (event.candidate.candidate === '') {
    //               return;
    //             }
    //             const {candidate} = event;
    //             candidates.push(candidate);
    //         } else if (!('onicegatheringstatechange' in RTCPeerConnection.prototype)) {
    //             pcTEST.close();
    //             pcTEST = null;
    //         }
    //     };
    //     pcTEST.onicegatheringstatechange = (event) => {
    //         if (pcTEST.iceGatheringState !== 'complete') {
    //             return;
    //           }
    //           const row = document.createElement('tr');
    //           pcTEST.close();
    //           pcTEST = null;
    //     };
    //     pcTEST.onicecandidateerror = (event) => {
    //         console.log("error");
    //         console.log(event.errorText)
    //         console.log(event)
    //     };
    //     pcTEST.createOffer(offerOptions).then(
    //         (desc) => {
    //             console.log(desc)
    //             begin = window.performance.now();
    //             candidates = [];
    //             pcTEST.setLocalDescription(desc);
    //         },
    //         (error) => { console.log('Error creating offer: ', error);}
    //     );
    //     console.log("start testing")
    // }

    // const checkIceTurn = (ms, callback) => {
    //     return new Promise(function(resolve, reject) {
    //         // Set up the real work
    //         callback(resolve, reject);
    
    //         // Set up the timeout
    //         setTimeout(function() {
    //             reject('Promise timed out after ' + ms + ' ms');
    //         }, ms);
    //     });
    // }
    const makeCall = () => {
        var options = {};
        async.series([
            (callback) => {
                var eventHandlers = {
                    'progress':  (e) => {
                        console.log('call is in progress') },
                    'failed':    (e) => {
                        if(e.cause === "User Denied Media Access"){
                            alert("ไม่สามารถเข้าถึงสิทธิ์การใช้งานกล้องวิดีโอ")
                        }
                    },
                    'ended':     (e) => {
                        console.log("ended", e)
                        registerData.userAgent.unregister();
                        setWebStatus("dialpad")
                    },
                    'confirmed': (e) => {},
                    'icecandidate' : (e) => {},
                    'reinvite' : (e) =>{},
                    'sdp' : (e) => {
                        if(e.originator === "local"){
                            e.sdp = removeAllButH264(e.sdp);
                            e.sdp = addTIAS(e.sdp, 100);
                        }
                    }
                };
                
                function removeAllButH264(sdp) {
                    var updated_sdp = "";
                    updated_sdp = sdp.replace("a=rtpmap:120 VP8/90000\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtpmap:121 VP9/90000\r\n","");
                    // updated_sdp = updated_sdp.replace(/m=video ([0-9]+) UDP\/TLS\/RTP\/SAVPF ([0-9 ]*) 120/g, "m=video $1  UDP\/TLS\/RTP\/SAVPF $2");
                    // updated_sdp = updated_sdp.replace(/m=video ([0-9]+) UDP\/TLS\/RTP\/SAVPF 120([0-9 ]*)/g, "m=video $1 UDP\/TLS\/RTP\/SAVPF$2");
                    // updated_sdp = updated_sdp.replace(/m=video ([0-9]+) UDP\/TLS\/RTP\/SAVPF ([0-9 ]*) 121/g, "m=video $1  UDP\/TLS\/RTP\/SAVPF $2");
                    // updated_sdp = updated_sdp.replace(/m=video ([0-9]+) UDP\/TLS\/RTP\/SAVPF 121([0-9 ]*)/g, "m=video $1 UDP\/TLS\/RTP\/SAVPF$2");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 goog-remb\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 nack\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 nack pli\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:120 ccm fir\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:121 goog-remb\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:121 nack\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:121 nack pli\r\n","");
                    updated_sdp = updated_sdp.replace("a=rtcp-fb:121 ccm fir\r\n","");
                    return updated_sdp;
                }
                function addTIAS(sdp, value) {
                    var updated_sdp = "";
                    updated_sdp = sdp.replace(/m=video (.*)\r\n/g,
                              "m=video $1\r\nb=TIAS:" + value + "\r\n");
                    return updated_sdp;
                }
 
                var pcConfig = {};

                pcConfig = {
                    "iceServers" : [{ url:"turn:turn2.im9.co?transport=tcp", username: "turn01", credential:"Test1234"}],
                    "bundlePolicy" : "max-compat",
                    "iceTransportPolicy":"all",
                    'rtcpMuxPolicy' : "negotiate",
                }
                
                options = {
                    'eventHandlers'    : eventHandlers,
                    'mediaConstraints' : constraints,
                    'pcConfig' : pcConfig,
                    'sessionTimersExpires' : 3600
                };
        
                registerData.userAgent.on('newRTCSession', (data) => {
                    var session = data.session;
                    session.on('ended'    , (e) => {
                        // console.log("end", e)
                        dispatch(setWebStatus("terminate"))
                        registerData.userAgent.unregister();
                    });
                    session.on('failed'   , (e) => {
                        console.log("failed", e)
                        registerData.userAgent.unregister();
                        dispatch(setWebStatus("terminate"))
                    });
                    session.on("confirmed", (e) => {
                        localVideo.srcObject  = session.connection.getLocalStreams()[0];
                        remoteVideo.srcObject = session.connection.getRemoteStreams()[0];

                        setPeerconnection(session);
                        setConnection(true);
                    });
                });
                registerData.userAgent.on('newMessage', function(e){ 
                    try {
                        if(e.message._request.body.startsWith("@switch")){
                            setTimeout(() => {
                                localVideo.srcObject.getTracks().forEach(function(track){
                                    setShowLocalVideo(true)
                                    if(track.kind === "video"){ track.enabled = true; 
                                    }
                                }); 
                            }, 3000)
                            dispatch(setRegisterData("callNumber", e.message._request.body.split("|")[1]));
                        }else{
            
                            if(e.message._request.body === "@open_chat"){
        
                            }else if(!e.message._request.body.startsWith("<rtt")){
                                dispatch(setMessagedata(e.originator, e.originator, dateTime.create().format('H:M:S'), e.message._request.body));
                                setMsgRealtime("");
                            }else{
                                if(e.originator !== "local"){
                                    setMsgRealtimeRaw(e.message._request.body);
                                }
                            }
                        }
                    } catch (error) {}
                });
                callback();
            },
            () => {
                registerData.userAgent.call(`sip:${registerData.callNumber}@${registerData.domain}`, options)
            }
        ])
        
        
    };

    useEffect(() => {
        if(chooseCamera){
            var promise1 = new Promise((resolve, reject) => {
                const tracks = localVideo.srcObject.getTracks();
                tracks.forEach(function(track) {
                    track.stop();
                });
                localVideo.srcObject = null;
                resolve()
            })
            promise1.then(()=>{
                if(constraints.video.facingMode === "user"){
                    constraints.video.facingMode = "environment";
                }else{
                    constraints.video.facingMode = "user";
                }
                constraints.video.facingMode = chooseCamera;
                navigator.mediaDevices.getUserMedia(constraints)
                .then((stream)=>{
                    localVideo.srcObject = stream;
                    peerconnection.connection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0])
                    peerconnection.connection.getSenders()[0].replaceTrack(stream.getAudioTracks()[0])
                    // peerconnection.renegotiate();
                })
                .catch(e => console.error(e));
            });
        }
    },[chooseCamera, peerconnection])

    const handleChooseCamera = () =>{
        if(chooseCamera === "environment"){ setChooseCamera("user"); }else{ setChooseCamera("environment") }
    }

    useEffect(() => {
        if(msgRealtimeRaw !== ""){
            const previewText = (message) => {
                var rs = convert.xml2json(message, {compact: true, spaces: 4});
                    rs = JSON.parse(rs);
                if(rs.rtt.t){
                    if(rs.rtt._attributes.event === "new"){
                        return rs.rtt.t._text;
                    }else if(rs.rtt._attributes.event === "reset"){
                        if(rs.rtt.e){
                            var txt = rs.rtt.t[0]._text;
                            var tmp;
                            for (let index = 0; index < rs.rtt.e._attributes.n; index++) {
                                tmp = removeCharacter(txt, rs.rtt.e._attributes.p-1)
                            }
                            return tmp
                        }else{
                            if(rs.rtt.t._text){
                                return rs.rtt.t._text
                            }else if(rs.rtt.t[0]._text) {
                                return rs.rtt.t[0]._text + "" + rs.rtt.t[2]._text;
                            }else{
                                return '';
                            }
                        }
                    }else {
                        if(rs.rtt.t._attributes){
                            var add = addCharater(msgRealtime, rs.rtt.t._text, rs.rtt.t._attributes.p)
                            return add;
                        }else{
                            return msgRealtime + "" + rs.rtt.t._text;
                        }
                    }
                }else if(rs.rtt.e){
                    tmp = msgRealtime;
                    for (let index = 0; index < rs.rtt.e._attributes.n; index++) {
                        tmp = removeCharacter(msgRealtime, rs.rtt.e._attributes.p-1)
                    }
                    return tmp
                }
            }
            setMsgRealtime(previewText(msgRealtimeRaw));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[msgRealtimeRaw])

    const removeCharacter = (str, char_pos) => {
        var part1 = str.substring(0, char_pos);
        var part2 = str.substring(char_pos + 1, str.length);
        return (part1 + part2);
    }
    const addCharater = (str, stradd, char_pos) => {
        var output = [str.slice(0, char_pos), stradd, str.slice(char_pos)].join('');
        return output;
    }

    const handleIOSClass = () => {
        if(browser.os === 'iOS'){
            if(iOSDevice === "iphone-control"){
                if(controlVideo.show){
                    return "vdo_call_show"
                }else{
                    return `${iOSDevice} vdo_call_show`;
                }
            }else{
                return "vdo_call_show";
            }
        }
        return "";
    }

    return (
        <>
            <div className="vdocall-keypad">
                {!matchMedia.matches? <Chat messageRealtime={msgRealtime} /> : <div/>}
                <div className="vdo-calling" id="main">
                    <Statusbar  handleChooseCamera = {handleChooseCamera} stopWatch = {<VideoStopwatch start={connection} />} />
                    <div className="incoming-sec">
                        <div className="incoming-calls calls-waiting" id="call-mobile">
                            <div 
                                id="waiting_mobile"
                                style={!showLocalVideo?{marginTop:"15vh", marginBottom: "16vh", maxHeight: "45vh"}:{}}
                            >
                                <div className={`${iOSDevice} img-vdo`}>
                                    <video id="remote-video" poster={require("./img/waiting.png")} className="remote-video" autoPlay playsInline/>
                                </div>
                            </div>
                            <div className={`${handleIOSClass()} img-vdo img-vdo d-block mb-3 `} id="img_vdocall" >
                                {matchMedia.matches? <div> <ChatInVideo messageRealtime={msgRealtime} iOSDevice={iOSDevice}/> <ControlVideo2/> </div> : <div/> }
                                <video id="local-video" className="local-video" alt="local-video" muted autoPlay playsInline />
                            </div>
                            {!matchMedia.matches? <ControlVideo/> : <div/>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoCall;