import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login/LoginTemplate';
import SignUp from './SignUp/SignUpTemplate';
import {BrowserRouter as Router,Route,} from 'react-router-dom';
import { store } from './store/store';


const render = function(){
    ReactDOM.render(
        <Router>
            <div>
                <Route exact path="/" component={Login}/>
                <Route path="/signUp" component={SignUp}/>
            </div>
        </Router>
      
      ,document.getElementById('root')
    );
}

store.subscribe(render);
render();
