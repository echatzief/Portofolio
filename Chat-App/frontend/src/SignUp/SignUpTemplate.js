import React,{Component} from 'react';
import { store } from '../store/store';
import {changeField,changeWarningBox} from '../actions/act';
import axios from 'axios';
/* The signUp style */
const signUpContainer={
    marginTop:'8%',
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
const signUpButContainer={
    marginTop:'3%',
    borderRadius:'30px',
}
const signUpBut={
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
const warning={
    display:store.getState().warningBoxVisible
}

class SignUpTemplate extends Component{

    changeEmail = (e)=>{
        store.dispatch(changeField("CHANGE_SIGN_UP_EMAIL",e.target.value));
    }
    changePassword = (e)=>{
        store.dispatch(changeField("CHANGE_SIGN_UP_PASSWORD",e.target.value));
    }
    changeUsername = (e)=>{
        store.dispatch(changeField("CHANGE_SIGN_UP_USERNAME",e.target.value));
    }
    changeMemberPassword = (e)=>{
        store.dispatch(changeField("CHANGE_SIGN_UP_MEMBER_PASSWORD",e.target.value));
    }

    //Check if we can submit 
    submitWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.signUpNow();
        }
    }

    //Show or hide the box
    closeTheBox = ()=>{
        store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'none',''));
    }

    signUpNow = ()=>{
        console.log("USERNAME: "+store.getState().signUpFormUsername+" PASSWORD: "+store.getState().signUpFormPassword+" EMAIL: "
        +store.getState().signUpFormEmail+" MEMBER PASSWORD: "+store.getState().signUpFormMemberPassword);

        var signUpInterface={
            email:store.getState().signUpFormEmail,
            username:store.getState().signUpFormUsername,
            password:store.getState().signUpFormPassword,
            memberPassword:store.getState().signUpFormMemberPassword,
        }

        /* Try to sign Up */
        axios.post('/tryToSignUp',{signUpInterface})
        .then(res=>{
            if(res.status == 204){
                store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'block',"User already exists."));
            }
            else if(res.status == 205){
                store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'block',"Wrong member password."));
            }
            else{
                store.dispatch(changeWarningBox("CHANGE_WARNING_BOX",'block',"Successfully Added."));
            }
        })

        /* Clear the fields*/
        store.dispatch(changeField("CLEAR_FIELDS",""));
    }
    render(){
        return(
            <div className="container text-center" style={signUpContainer}>
                <span style={span}>Sign Up Now</span>
                
                <div className="container text-center alert alert-info alert-dismissible" style={Object.assign({display:store.getState().warningBoxVisible},dataInput)}>
                    <a href="#" className="close" onClick={this.closeTheBox}>&times;</a>
                    <strong>{store.getState().warningBox}</strong>
                </div>
                {/* Email input*/}
                <div style={dataInput} className="container text-center">
                    <input type="email" style={changeInput} className="form-control" id="emailData" onChange={this.changeEmail} value={store.getState().signUpFormEmail} placeholder="Email"></input>
                </div>

                <div style={dataInput} className="container text-center">
                    <input type="text" style={changeInput} className="form-control" id="usernameData" onChange={this.changeUsername} value={store.getState().signUpFormUsername} placeholder="Username"></input>
                </div>

                <div style={dataInput} className="container text-center">
                    <input type="password" style={changeInput} className="form-control" id="passwordData" onChange={this.changePassword}  value={store.getState().signUpFormPassword} placeholder="Pasword"></input>
                </div>

                <div style={dataInput} className="container text-center">
                    <input type="password" style={changeInput} className="form-control" id="memberpass" onKeyPress={this.submitWithEnter} onChange={this.changeMemberPassword}  value={store.getState().signUpFormMemberPassword} placeholder="Member password"></input>
                </div>

                {/* SignUp Button*/}
                <div style={signUpButContainer}>
                    <button style={signUpBut} type="button" className="btn btn-dark" onClick={this.signUpNow}>Sign Up</button>
                </div>
                
                {/*Sign Up reference*/}
                <div style={newAccountDiv}>
                    <span style={newAccount}>
						You already have an account?
					</span>
                    <div>
                        <a href="/" style={hrefStyle} className="hrefStyle">LOGIN NOW</a>
                    </div>
                </div>

            </div>
        );
    }
}

export default SignUpTemplate;