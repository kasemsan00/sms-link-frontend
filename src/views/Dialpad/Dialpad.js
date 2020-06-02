import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWebStatus, setRegisterData } from '../../actions';
import { logoutTTRS } from '../../actions/fetchAPI';
import PhoneKeyboard from './PhoneKeyboard';
// import Setting from './Setting';
import { FiLogOut } from "react-icons/fi";
import './css/style.css';
const JsSIP = require("jssip");
const matchMedia = window.matchMedia("(max-width: 768px)");

const Dialpad = () => {
    
    const dispatch  = useDispatch();
    const [mobileControl, setMobileControl] = useState(false);
    const registerData = useSelector(state => state.registerData);
    const [cameraEnable, setCameraEnable] = useState(false)
    // const [settingEnable, setSettingEnable] = useState(false);

    const handleStaticCall = (type) => {
        switch (type) {
            case "vri":
                dispatch(setRegisterData("callNumber", 14120));
                break;
            case "helpdesk":
                dispatch(setRegisterData("callNumber", 14127));
                break;
            case "emergency":
                dispatch(setRegisterData("callNumber", 14121));
                break;
            default:
                break;
        }
        if(cameraEnable === true){
            dispatch(setWebStatus("register"))
        }
    }
    const handleMobileDialPad = () => {
        setMobileControl(true)
    }
    const handleLogout = () => {
     
        // var socket = new JsSIP.WebSocketInterface("wss://sipclient.ttrs.in.th:8089/ws");
        var socket = new JsSIP.WebSocketInterface("wss://wvrs.iagent.in.th:7443");

        var configuration = {
            sockets : [ socket ],
            uri      : `${registerData.extension}@wvrs.iagent.in.th`, 
            password : `${registerData.secret}`,
            register_expires : 3,
        };

        var userAgent = new JsSIP.UA(configuration);
        userAgent.start();

        let promise = new Promise( (resolve, reject) => {
            userAgent.on("registered", function(){
                var options = {
                    all: true
                };
                userAgent.unregister(options);
                resolve();
            });
            userAgent.on("registrationFailed", function(){
                resolve();
            });
        });
        promise.then(() => {
            logoutTTRS(localStorage.getItem("token"));
            localStorage.clear();
            // window.location = "/";
            dispatch(setWebStatus("login"));
        })
    }

    const handleShortCut = (value) => {
        if(value === "MobileDialPad"){
            handleMobileDialPad();
        }else if(value === "Shortcut"){
            setMobileControl(false);
        }
    }
    
    // const handleSetting = (value) => {
        
    //     setSettingEnable(value);
    // }

    useEffect(() => {
        document.body.style.backgroundColor = "white";
        // checkAllowCameraAndMic();
    },[])

    useEffect(() => {
        // if(!isIpadOS()){
        //     checkAllowCameraAndMic();
        // }
        let promise = new Promise(function(resolve, reject) {
            dispatch(setRegisterData("domain", "wvrs.iagent.in.th"));
            dispatch(setRegisterData("websocket", "wss://wvrs.iagent.in.th:7443"));
            dispatch(setRegisterData("extension", registerData.extension))
            dispatch(setRegisterData("secret", registerData.secret));
            getCurrentLocation();
            resolve();
        });
        promise.then(() => {
            setCameraEnable(true)
        })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            localStorage.setItem("accuracy", position.coords.accuracy);
            localStorage.setItem("lat", position.coords.latitude)
            localStorage.setItem("long", position.coords.longitude)
        });
    }
    // const checkAllowCameraAndMic = () => {
    //     var constraints = { 
    //         audio: true, 
    //         video: true,
    //         optional: [
    //             { facingMode: "user" }
    //         ]
    //     };
        
    //     navigator.mediaDevices.getUserMedia(constraints)
    //     .then((stream)=>{
    //         setCameraEnable(true);
    //     }).catch(function(err) {
    //         console.log(err);
    //         alert("ไม่สามารถเข้าถึงสิทธิ์การใช้งานกล้องวิดีโอ")
    //     });
    // }
    // const isIpadOS = () => {
    //     return navigator.maxTouchPoints &&
    //       navigator.maxTouchPoints > 2 &&
    //       /MacIntel/.test(navigator.platform);
    // }
    return (
        <>
            <div className="show">
                <div className="shortcuts-phonekeypad">
                    {mobileControl? <PhoneKeyboard cameraEnable={cameraEnable} cls=""/> : <></> }

                    {
                    
                        // settingEnable? <div/>  :
                        
                        <>
                            <div className={`shortcuts ${mobileControl? "hide" : ""}`}>
                                <div className="d-block d-md-none">
                                    <div className="vrs_map">
                                        <div className="txt-vrs">VRS</div>
                                    </div>
                                </div>

                                <div className="position-relative">
                                    <br/><br/>
                                    <h2 className="head-title">ทางลัด</h2>
                                    <br/><br/>
                                </div>

                                <div className="row" >
                                    <div className="col-12 col-md-12 col-lg-6">
                                        <div className="shortcuts-box">
                                            <a  
                                                href="#!" 
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={event => handleStaticCall("vri")}
                                            >
                                                <div className="img-icon">
                                                    <div className="ttrs-vri"></div>
                                                </div>
                                                <div className="txt-desc">
                                                    <div 
                                                        className="head" 
                                                        
                                                    >TTRS VRI</div>
                                                </div>
                                            </a>

                                            <div className="exp-vdo" data-toggle="modal" data-target="#ShowVdo7">
                                                <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                                            </div>

                                            <div className="modal fade" id="ShowVdo7" tabIndex="-1" role="dialog" aria-labelledby="Title"
                                                aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered" role="document">
                                                    <div className="modal-content modal_exp_vdo">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>

                                                        <div className="modal-body">
                                                            <div className="exp_vdo">
                                                                <img src={require("./img/img-vdo.png")} alt=""/>
                                                            </div>
                                                        </div>

                                                        <h6 className="exp_title">การเข้าระบบ</h6>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-6 hide" >
                                        <div className="shortcuts-box">
                                            <a 
                                                href="#!" 
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={event => handleStaticCall("helpdesk")}
                                            >
                                                <div className="img-icon">
                                                    <div className="ttrs-helpdesk"></div>
                                                </div>
                                                <div className="txt-desc">
                                                    <div className="head">TTRS Helpdesk</div>
                                                </div>
                                            </a>

                                            <div className="exp-vdo" data-toggle="modal" data-target="#ShowVdo8">
                                                <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                                            </div>

                                            <div className="modal fade" id="ShowVdo8" tabIndex="-1" role="dialog" aria-labelledby="Title"
                                                aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered" role="document">
                                                    <div className="modal-content modal_exp_vdo">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>

                                                        <div className="modal-body">
                                                            <div className="exp_vdo">
                                                                <img src={require("./img/img-vdo.png")} alt=""/>
                                                            </div>
                                                        </div>

                                                        <h6 className="exp_title">การเข้าระบบ</h6>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-6 hide">
                                        <div className="shortcuts-box">
                                            <a 
                                                href="#!" 
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={event => handleStaticCall("emergency")}
                                            >
                                                <div className="img-icon">
                                                    <div className="ttrs-emergency"></div>
                                                </div>
                                                <div className="txt-desc">
                                                    <div className="head" >TTRS Emergency</div>
                                                </div>
                                            </a>

                                            <div className="exp-vdo" data-toggle="modal" data-target="#ShowVdo9">
                                                <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                                            </div>

                                            <div className="modal fade" id="ShowVdo9" tabIndex="-1" role="dialog" aria-labelledby="Title"
                                                aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered" role="document">
                                                    <div className="modal-content modal_exp_vdo">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>

                                                        <div className="modal-body">
                                                            <div className="exp_vdo">
                                                                <img src={require("./img/img-vdo.png")} alt=""/>
                                                            </div>
                                                        </div>

                                                        <h6 className="exp_title">การเข้าระบบ</h6>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-12 col-md-12 col-lg-6 ${matchMedia.matches? "" : "hide"}`}>
                                        <div className="shortcuts-box" >
                                            <a 
                                                href="#!" 
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={event => handleMobileDialPad()}
                                            >
                                                <div className="img-icon">
                                                    <div className="phone-keypad"></div>
                                                </div>
                                                <div className="txt-desc" >
                                                    <div className="head">TTRS VRS</div>
                                                </div>
                                            </a>
                                            <div className="exp-vdo" data-toggle="modal" data-target="#ShowVdo10">
                                                <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                                            </div>
                                            <div className="modal fade" id="ShowVdo10" tabIndex="-1" role="dialog" aria-labelledby="Title"
                                                aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered" role="document">
                                                    <div className="modal-content modal_exp_vdo">
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                        <div className="modal-body">
                                                            <div className="exp_vdo">
                                                                <img src={require("./img/img-vdo.png")} alt=""/>
                                                            </div>
                                                        </div>

                                                        <h6 className="exp_title">การเข้าระบบ</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`col-12 col-md-12 col-lg-6`} onClick={event => handleLogout()}>
                                        <div className="shortcuts-box" >
                                            <a 
                                                href="#!" 
                                                className="d-flex align-items-center justify-content-center"
                                                onClick={event => handleLogout()}
                                            >
                                                <div className="img-icon">
                                                    <FiLogOut size={33}/>
                                                </div>
                                                <div className="txt-desc" >
                                                    <div className="head">ออกจากระบบ</div>
                                                </div>
                                            </a>
                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    {/* <div className="shortcuts-menu" style={{width:"50%"}}>
                        <div className={`btn_shortcuts-menu ${settingEnable? "" : "active"}`} style={{width:"50%"}}>
                            <a className="txt-menu icn-shortcuts" onClick={event => handleSetting(false)}>ทางลัด</a>
                        </div>
                        <div className={`btn_shortcuts-menu ${settingEnable? "active" : ""}`} style={{width:"50%"}}>
                            <a className="txt-menu icn-setting" onClick={event => handleSetting(true)}>ตั้งค่า</a>
                        </div>
                    </div> */}
                    {matchMedia.matches?                     
                    
                        <div className="shortcuts-menu">
                            <div className={`btn_shortcuts-menu ${mobileControl? "" : "active"}`} style={{width:"50%"}} onClick={event => handleShortCut("Shortcut") }>
                                <a className="txt-menu icn-shortcuts" href="#!">ทางลัด</a>
                            </div>
                            <div className="btn_shortcuts-menu d-block d-md-none" style={{width:"50%"}}  onClick={ event =>  handleShortCut("MobileDialPad")} >
                                <a className="txt-menu icn-call" href="#!">โทรศัพท์</a>
                            </div>
                        </div> 
                        : 
                        <PhoneKeyboard cameraEnable={cameraEnable} />
                    }
                </div>
            </div>
        </>
    )
};

export default Dialpad;