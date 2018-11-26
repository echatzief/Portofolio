import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/LoginTemplate';
import SignUp from './SignUp/SignUpTemplate';
import FrontPanel from './FrontPanel/FrontPanelTemplate';
import {BrowserRouter as Router,Route,} from 'react-router-dom';
import { store } from './store/store';
import {mainPanelStore} from './store/mainPanelStore';


const render = function(){
    ReactDOM.render(
        <Router>
            <div>
                <Route exact path="/" component={Login}/>
                <Route path="/signUp" component={SignUp}/>
                <Route path="/frontPanel" component={FrontPanel}/>
            </div>
        </Router>
      
      ,document.getElementById('root')
    );
}

store.subscribe(render);
mainPanelStore.subscribe(render);
render();
