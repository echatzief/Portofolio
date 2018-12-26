import {createStore} from 'redux';
import reducer from '../reducers/ChatReducer';

const initialState={
    username:'',
    friendName:null,
}

export const ChatStore=createStore(reducer,initialState);