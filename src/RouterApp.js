import React, {useEffect, 
    // useState
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VideoCall, ReceivingCall, Register, EndCall, Dialpad, Login, Help } from './views';
import { setWebStatus, setRegisterData } from './actions';
import { verifyAuth } from './actions/fetchAPI';

const RouterApp = () => {

    const webStatus = useSelector(state => state.webStatus);
    // const [localStream, setLocalStream] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        // checkAllowCameraAndMic();
        verifyAuth(localStorage.getItem("token"), (result) => {
            if(result && result !== "invalid" && result !== "expire"){ 
                dispatch(setRegisterData("secret", result.secret));
                dispatch(setRegisterData("extension", result.ext));
                dispatch(setWebStatus("dialpad"));
            }else{
                dispatch(setWebStatus("login"));
            }
        })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[localStorage.getItem("token")])
    
    // const verifyToken = () => {
    //     verifyAuth(localStorage.getItem("token"), (result) => {
    //         if(result && result !== "invalid" && result !== "expire"){ 
    //             dispatch(setRegisterData("secret", result.secret));
    //             dispatch(setWebStatus("dialpad"));
    //         }else{
    //             dispatch(setWebStatus("login"));
    //         }
    //     })
    // }
    
    // const checkAllowCameraAndMic = () => {
    //     var constraints = { 
    //         audio: true, 
    //         video: {
    //                 frameRate : {
    //                     min: "15 ",
    //                     max: "15"
    //                 },
    //                 width: {
    //                     min: "352 ",
    //                     max: "352 "
    //                 },
    //                 height: {
    //                     min: "240",
    //                     max: "240"
    //                 },    
    //         },
    //         optional: [
    //             { facingMode: "user" }
    //         ]
    //     };
        
    //     navigator.mediaDevices.getUserMedia(constraints)
    //     .then((stream)=>{
    //         setLocalStream(stream);
    //     }).catch(function(err) {
    //         alert("ไม่สามารถเข้าถึงสิทธิ์การใช้งานกล้องวิดีโอ")
    //     });
    // }

    switch (webStatus) {
        case "callVRS":
            return (<VideoCall/>)
        case "callVRI":
            return (<VideoCall/>)
        case "receivingCall" : 
            return (<ReceivingCall/>)
        case "vrsReceivingCall" :
            return (<VideoCall/>)
        case "terminate" :
            return (<EndCall/>)
        case "register" : 
            return (<Register/>)
        case "dialpad" : 
            return (<Dialpad/>)
        case "login" : 
            return (<Login/>)
        case "help" : 
            return (<Help/>)
        default:
            return (<div></div>)
            // return (<UserDetail/>)
    }
}
export default RouterApp;