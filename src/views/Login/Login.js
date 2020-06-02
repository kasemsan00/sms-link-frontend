import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginTTRS } from '../../actions/fetchAPI';
import { setWebStatus } from '../../actions';
import './css/style.css';
const { detect } = require('detect-browser');
const browser = detect();
const dev = true;

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(false);
    const [accessBrowser, setAccessBrowser] = useState(false);
    const dispatch = useDispatch();

    document.body.style.backgroundColor = "#FAFAFF";
    const handleUsername = (event) => {
        setUsername(event.target.value)
    }
    const handlePassword = (event) => {
        setPassword(event.target.value)
    }
    const handleLogin = (event) => {
        loginTTRS(username, password, (result) => {
            if(result.status === "OK"){
                localStorage.setItem("token", result.data.token);
                localStorage.setItem("datetoken", new Date());
                dispatch(setWebStatus("dialpad"));
                setLoginStatus(false)
            }else{
                localStorage.setItem("token", "");
                setLoginStatus(true)
            }
        })
    }

    useEffect(() => {
        if(!dev){
            if(browser.name === "firefox"){
                alert("การสนทนาวิดีโอไม่รองรับการใช้งานเว็บบราวเซอร์ Mozilla Firefox กรุณาเปลี่ยนบราวเซอร์เช่น Google Chrome")
                localStorage.clear();
                setAccessBrowser(true)
            }else
            if(browser.os === "Android OS" ){
                alert("การสนทนาวิดีโอยังไม่รองรับการใช้งานบน iOS และ Android กรุณาใช้แอพพลิเคชั่น TTRS VDO")
                setAccessBrowser(true)
            }
            if(browser.os === "iOS"){
                alert("การสนทนาวิดีโอยังไม่รองรับการใช้งานบน iOS และ Android กรุณาใช้แอพพลิเคชั่น TTRS VDO")
                setAccessBrowser(true)
            }
            if(isIpadOS()){
                alert("การสนทนาวิดีโอยังไม่รองรับการใช้งานบน iOS และ Android กรุณาใช้แอพพลิเคชั่น TTRS VDO")
                setAccessBrowser(true)
            }
        }
    },[])
      
    const isIpadOS = () => {
        return navigator.maxTouchPoints &&
          navigator.maxTouchPoints > 2 &&
          /MacIntel/.test(navigator.platform);
    }
    return (<>
        <div className="page">
            <div className="log-in">
                <div className="login_box">
                    <div className="log-in_box">
                        <div className="logo">
                            <img className="logo-hand2-blue" src={require("./img/logo-hand2-blue.png")} style={{width:"140%", marginLeft:"-20px"}} alt=""/>
                        </div>
                        <br/>
                        <h2 className="entry-title">บริการถ่ายทอดการสื่อสารแบบสนทนาวิดีโอบนอินเทอร์เน็ต</h2>
                        <div className="ipt_log-in">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <img src={require("./img/logo-user.png")} alt=""/>
                                </div>
                                <input type="text" className="form-control" placeholder="ชื่อผู้ใช้" aria-label="Username" value={username} onChange={handleUsername}
                                    aria-describedby="addon-wrapping"/>
                            </div>

                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <img src={require("./img/logo-password.png")} alt=""/>
                                </div>
                                <input type="password" className="form-control" placeholder="รหัสผ่าน" aria-label="Password" value={password} onChange={handlePassword}
                                    aria-describedby="addon-wrapping"/>
                            </div>

                            <div className={`input-group warning-password ${!loginStatus? "hide":""}`}>
                                <div>ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง</div>
                            </div>
                            <br/>
                            
                            <button className="btn btn-login" type="submit" onClick={event => handleLogin()} disabled={accessBrowser} >เข้าสู่ระบบ</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Login;