import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWebStatus, setRegisterData } from '../../actions';
import { callLog } from '../../actions/fetchAPI';
import {ProgressBar} from 'react-bootstrap';
const JsSIP = require("jssip");

const Register = () => {
    const [registerProgress, setRegisterProgress] = useState(0);
    const registerData = useSelector(state => state.registerData);
    const dispatch  = useDispatch();

    useEffect(()=>{
        setRegisterProgress(20)
        registerSip(() => {
            dispatch(setWebStatus("callVRS"));
        });
        callLog({
            token : localStorage.getItem("token"),
            accuracy : localStorage.getItem("accuracy"),
            latitude : localStorage.getItem("lat"),
            longitude : localStorage.getItem("long")
        },() => {
        })
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const registerSip = (callback) => {
        setRegisterProgress(30)
        // var socket = new JsSIP.WebSocketInterface("wss://sipclient.ttrs.in.th:8089/ws");
        var socket = new JsSIP.WebSocketInterface("wss://wvrs.iagent.in.th:7443");
        // socket.via_transport = "tcp";
        
        var configuration = {
            sockets : [ socket ],
            uri      : `${registerData.extension}@wvrs.iagent.in.th`, 
            password : registerData.secret,
            register_expires : 60,
        };
        setRegisterProgress(60)
        var userAgent = new JsSIP.UA(configuration);
        userAgent.start();
        userAgent.on("registered", function(){
            setRegisterProgress(100);
            dispatch(setRegisterData("userAgent", userAgent));
            callback()
        });
        userAgent.on("registrationFailed", function(){
            userAgent.unregister();
            dispatch(setWebStatus("login"));
            localStorage.clear();
        });
    }
    return (
        <>
            <div className="loading-home" style={{background:"linear-gradient(180deg, #0f3548 0%, #0e3244 67%, #0a2431 100%)", height:"100vh"}}>
                <div className="container">
                    <div className="loading-logo">
                        <div className="logo" style={{width:"20vh"}}>
                            <img src={require("./img/logo-ttrs-white.png")} alt=""/>
                            <img src={require("./img/logo-hand-white.png")} alt=""/>
                        </div>
                    </div>
                    <div className="loading-holdon">
                        <div className="loading">
                            <div className="logo" style={{width:"20vh"}}>
                                <img src={require("./img/logo-hand1-white.png")} alt=""/>
                            </div>
                            <br/><br/>
                            <ProgressBar animated now={registerProgress} style={{width:"42vh"}}/>
                            <p>โปรดรอสักครู่</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Register;