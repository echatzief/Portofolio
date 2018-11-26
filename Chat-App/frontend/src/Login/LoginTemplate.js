import React,{Component} from 'react';
import './Login.css';
import {store} from '../store/store';
import  {changeField,changeWarningBox}  from '../actions/act';
import axios from 'axios';
import { mainPanelStore } from '../store/mainPanelStore';
/* The style we use at the login form */
const LoginContainer={
    marginTop:'10%',
}
const span ={
    fontFamily:'Oswald-Medium',
    fontSize:'50px',
    color:'#43383e',
    lineHeight:'1.2',
    textAlign:'center',
    display:'block',
}
const dataInput={
    marginTop:'3%',
    width:'50%',
}
const changeInput={
    borderRadius:'30px',
    padding:'25px'
}
const LoginButCont={
    marginTop:'3%',
    borderRadius:'30px',
}
const LoginBut={
    borderRadius:'30px',
    width:'200px'
}
const newAccountDiv={
    marginTop:'3%',
    marginBottom:'10%',
}
const newAccount={
    fontFamily:'Oswald-Regular',
    fontSize:'16px',
    color:'#999999',
    lineHeight:'1.4',
}
const hrefStyle={
    fontFamily:'Oswald-Regular',
    fontSize:'16px',
    color:'#333333',
    lineHeight:'1.2',
}

class LoginTemplate extends Component{
    
    /* Change the input fields*/
    changeEmail = (e)=>{
        store.dispatch(changeField("CHANGE_LOGIN_EMAIL",e.target.value));
    }
    changePassword = (e)=>{
        store.dispatch(changeField("CHANGE_LOGIN_PASSWORD",e.target.value));
    }

    //Check if we can submit 
    submitWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.loginNow();
        }
    }

    //hide the box
    closeTheBox = ()=>{
        store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'none',''));
    }

    /* Login function to go in to the chat */
    loginNow = (e)=>{
        console.log("EMAIL: "+store.getState().loginFormEmail+" PASSWORD: "+store.getState().loginFormPassword);
        

        var loginUserInterface={
            email:store.getState().loginFormEmail,
            password:store.getState().loginFormPassword,
        }

        /* Try to login */
        axios.post('/tryToLogin',{loginUserInterface})
        .then((res)=>{
            
            /* Wrong password or email or username */
            if(res.status === 204){
                store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'block',"Wrong combination of credentials."));
            }
            else{
                /* Pass the username to the next store*/
                mainPanelStore.dispatch(changeField("CHANGE_CURRECT_USER",res.data));
                this.props.history.push('/frontPanel/');
            }
        })

        /* Clear the fields*/
        store.dispatch(changeField("CLEAR_FIELDS",""));
    }
    render(){
        return(
            <div className="container text-center" style={LoginContainer}>
                <span style={span}>Login</span>
               
                {/* Warning box */}
                <div className="container text-center alert alert-danger alert-dismissible" style={Object.assign({display:store.getState().warningBoxVisible},dataInput)}>
                    <button href="#" className="close" onClick={this.closeTheBox}>&times;</button>
                    <strong>{store.getState().warningBox}</strong>
                </div>

                {/* Email input*/}
                <div style={dataInput} className="container text-center">
                    <input type="email" style={changeInput} className="form-control" id="emailData" onChange={this.changeEmail} value={store.getState().loginFormEmail} placeholder="Email"></input>
                </div>

                {/* Password input*/}
                <div style={dataInput} className="container text-center">
                    <input type="password" style={changeInput} onKeyPress={this.submitWithEnter} className="form-control" id="passwordData" onChange={this.changePassword}  value={store.getState().loginFormPassword}  placeholder="Password"></input>
                </div>

                {/* Login Button*/}
                <div style={LoginButCont}>
                    <button style={LoginBut} type="button" className="btn btn-dark" onClick={this.loginNow}>Login</button>
                </div>
                
                {/*Sign Up reference*/}
                <div style={newAccountDiv}>
                    <span style={newAccount}>
						Don’t have an account?
					</span>
                    <div>
                        <a href="/signUp" style={hrefStyle} className="hrefStyle">SIGN UP NOW</a>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default LoginTemplate;