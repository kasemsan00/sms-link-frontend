import React from 'react';
import ReactDOM from 'react-dom';
import RouterApp from './RouterApp';
import {createStore} from 'redux';
import allReducer from './reducers';
import {Provider} from 'react-redux';
import {BrowserRouter  as Router, Route, Switch} from 'react-router-dom';
import {VideoCall, ReceivingCall, ChooseConversation, Register, EndCall, Login, Help } from './views';
import { reToken } from './actions/fetchAPI';
import * as serviceWorker from './serviceWorker';
import './assets/css/style.css';

const AppRouter = () => (
    <Router >
        <Switch>
            {/* <Route exact path="/:jwttoken" component={router} /> */}
            {/* <Route exact path="/" component={router} /> */}
            <Route exact path="/" component={router} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/endcall" component={EndCall} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/videocall" component={VideoCall} />
            <Route exact path="/receivingcall" component={ReceivingCall} />
            <Route exact path="/help" component={Help} />
            <Route exact path="/ChooseConversation" component={ChooseConversation} />
        </Switch>
    </Router>
);


const router = ({match}) => (
    <RouterApp  jwttoken={match.params.jwttoken} />
);

setInterval(function(){
    if(localStorage.getItem("token") !== null){
        reToken(localStorage.getItem("token"), (result) => {
            if(result.status === "OK"){
                localStorage.setItem("token", result.data.token)
            }
            else{
                localStorage.clear()
                window.location = "/"
            }
        })
    }

}, 600000);
const store = createStore(allReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(<Provider store={store}> <AppRouter /> </Provider>, document.getElementById('root'));

serviceWorker.unregister();
