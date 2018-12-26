import React,{Component} from 'react';
import {ChatStore} from '../store/ChatStore';
import {changeField} from '../actions/mainPanelAct';
import Navbar from './Navbar';

class Chat extends Component{

    componentWillMount(){

        /* Get the username */
        var uname=localStorage.getItem('username');
        if(uname === null){
            this.props.history.push('/');
        }
        else{
            console.log("USERNAME: "+uname);
            ChatStore.dispatch(changeField("SET_USERNAME",uname));
            console.log("USERNAME AFTER: "+ChatStore.getState().username);
        }

        /* Get friends name */
        var friendName=localStorage.getItem('friend');
        if(friendName === null){
            this.props.history.push('/');
        }
        else{
            console.log("FRIEND USERNAME: "+friendName);
            ChatStore.dispatch(changeField("SET_FRIEND",friendName));
            console.log("FRIEND USERNAME AFTER: "+ChatStore.getState().friendName);
        }
        /* Get the messages */
    }
    render(){
        return(
            <Navbar />
        );
    }
}

export default Chat;