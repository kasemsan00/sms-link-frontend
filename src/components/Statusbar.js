import React from 'react';

const Statusbar = (props) => {
    return (                    
        <div className="head-sec">
            <div className="head-call">
                <div className="phone-numer">TTRS</div>
                <span style={{padding:"10px"}}>
                    <div className="cam_img">
                        {props.handleChooseCamera ?  
                            <div className="cam_img" onClick={props.handleChooseCamera}> 
                                <img src={require('./img/icon-cam-white.png')} alt="choose-camera" /> 
                            </div>
                            : "VRS"
                        }
                    </div>
                </span>
                <div className="calling-time">{props.stopWatch? props.stopWatch : "00:00:00"}</div>
            </div>
        </div>
    )
}

export default Statusbar;