import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { MdKeyboardBackspace, MdPhone } from "react-icons/md";
import { setWebStatus, setRegisterData } from '../../actions';
import './css/style.css'

const PhoneKeyboard = (props) => {

    const dispatch  = useDispatch();
    const [callNumber, setCallNumber] = useState("");

    const handleDialpad = event => {
        const current = event.currentTarget.textContent;
        setCallNumber(callNumber + current)
    };
    const handleRemoveCallNumber = event => {
        const current = callNumber.slice(0, -1);
        setCallNumber(current);
    }
    const handleVRSCall = () => {
        if(callNumber === "9999"){
            dispatch(setRegisterData("callNumber", "9999"));
        }else{
            dispatch(setRegisterData("callNumber", callNumber));
        }
        if(callNumber !== "" && props.cameraEnable === true){
            dispatch(setWebStatus("register"));
        }
    }
    const handleDialpadInput = (event) => {
        if(!isNaN(event.target.value) ){
            setCallNumber(event.target.value)
        }
    }

    return (
        <>
        <div className={`phonekeypad ${props.cls}`} style={{backgroundColor:"white"}}>
            <div className="vrs_map">
                {/* <a href="maplocation.html" className="map-location">รังสิต ปทุมธานี</a> */}
                <div className="txt-vrs">VRS</div>
            </div>

            <div className="show-keypad">
                <div className="container_keypad">
                    <div className="title">ระบุเบอร์โทรศัพท์</div>
                    <br/><br/>
                    <div className="d-flex justify-content-between align-items-center position-relative show-number">
                        <div id="output">
                            <input type="text" className="dialpad-input" value={callNumber} onChange={event=>handleDialpadInput(event)}/>
                            {/* <p>{callNumber}</p> */}
                        </div>
                        <div onClick={handleRemoveCallNumber} className="delete-callnumber">
                            <MdKeyboardBackspace size={35} onClick={handleRemoveCallNumber} style={{marginLeft:"-33px"}} />
                        </div>
                    </div>
                    <br/><br/>
                    <div className="row">
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad} >1</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>2</div>
                        </div>
                        <div className="col-4">
                            <div className="digit"onClick={handleDialpad} >3</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>4</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>5</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>6</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>7</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>8</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>9</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>*</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>0</div>
                        </div>
                        <div className="col-4">
                            <div className="digit" onClick={handleDialpad}>#</div>
                        </div>
                    </div>

                    <div className="botrow">
                        <div id="call" onClick={handleVRSCall} >
                            <i className="fa fa-phone" aria-hidden="true" >
                                <MdPhone/>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default PhoneKeyboard;