import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Button, Container, Row, Col, Form} from 'react-bootstrap'
import { setWebStatus, setRegisterData } from '../actions';
const JsSIP = require("jssip");

const UserDetail = () => {

    const {control, handleSubmit} = useForm();
    // const [websocketLog, setWebsocketLog] = useState("");
    const dispatch  = useDispatch();
    const webStatus = useSelector(state => state.webStatus);

    const registerSip = (data) => {
        var socket = new JsSIP.WebSocketInterface(data.Websocket);
        var configuration = {
            sockets : [ socket ],
            uri      : `${data.Extension}@${data.Host}`, 
            password : data.Password,
            session_timers: false,
        };
         
        var userAgent = new JsSIP.UA(configuration);
        userAgent.start();
        // userAgent.on("registered", function(){
            dispatch(setRegisterData("userAgent", userAgent));
            dispatch(setRegisterData("callNumber", data.CallNumber));
            dispatch(setRegisterData("extension", data.Extension));
            dispatch(setRegisterData("domain", data.Host));
            dispatch(setWebStatus("registered"));
        // });
        userAgent.on("newRTCSession", (data) => {

            var session = data.session; 
            // console.log(session)
            if (session.direction === "incoming") {
                dispatch(setRegisterData("session", session));
                dispatch(setWebStatus("receivingCall"))

            }
        });
    }

    const onSubmit = data => {
        for(var k in data) { localStorage.setItem(k, data[k]);}
        registerSip(data);
    }
    const handleCall = () => {
        dispatch(setWebStatus("callVRS"))
    }

    return (
        <Container>
            <br/>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group>
                            <Form.Label>Extension</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="Extension"
                                defaultValue={localStorage.getItem("Extension")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="Password"
                                defaultValue={localStorage.getItem("Password")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Host</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="Host"
                                defaultValue={localStorage.getItem("Host")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Websocket</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="Websocket"
                                defaultValue={localStorage.getItem("Websocket")}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>STUN</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="StunServer"
                                defaultValue={localStorage.getItem("StunServer")}
                            />
                        </Form.Group>
                        <Form.Row>
                            <Col>
                                <Form.Label>Turn Server</Form.Label>
                                <Controller
                                    as={<Form.Control size="sm"  type="text"  />}
                                    control={control}
                                    name="TurnServer"
                                    defaultValue={localStorage.getItem("TurnServer")}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Turn Username</Form.Label>
                                <Controller
                                    as={<Form.Control size="sm"  type="text"  />}
                                    control={control}
                                    name="TurnUsername"
                                    defaultValue={localStorage.getItem("TurnUsername")}
                                />
                            </Col>
                            <Col>
                                <Form.Label>Turn Password</Form.Label>
                                <Controller
                                    as={<Form.Control size="sm"  type="text"  />}
                                    control={control}
                                    name="TurnPassword"
                                    defaultValue={localStorage.getItem("TurnPassword")}
                                />
                            </Col>
                        </Form.Row>
                        <Form.Group>
                            <Form.Label>CallNumber</Form.Label>
                            <Controller
                                as={<Form.Control size="sm"  type="text"  />}
                                control={control}
                                name="CallNumber"
                                defaultValue={localStorage.getItem("CallNumber")}
                            />
                        </Form.Group>
                        {webStatus !== "registered"?
                        <Button variant="primary" block type="submit">Register</Button>  :
                        <Button variant="danger" block onClick={handleCall}>
                            Call {localStorage.getItem("CallNumber")}
                        </Button>  
                        }   
                        {/* <Form.Group>
                            <Form.Label>Websocket Logs</Form.Label>
                            <Form.Control as="textarea" rows="7"  type="text" value={websocketLog} readOnly  />
                        </Form.Group> */}
                    </Form>
                </Col>
            </Row>
        </Container>
    )   
}

export default UserDetail;
