import {createStore} from 'redux';
import reducer from '../reducers/red';

const initialState={
    loginFormEmail:'',              /* Email Field at Login Form*/
    loginFormPassword:'',           /* Password Field at Login Form*/
    signUpFormEmail:'',             /* Email Field at SignUp Form*/
    signUpFormPassword:'',          /* Password Field at SignUp Form*/
    signUpFormUsername:'',          /* Username Field at SignUp Form*/
    signUpFormMemberPassword:'',    /* Member Password Field at SignUp Form*/ 
}

export const store=createStore(reducer,initialState);