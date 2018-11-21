export default(state,action)=>{
    switch(action.type){
        case "CHANGE_LOGIN_EMAIL":
            return{
                loginFormEmail:action.data,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_LOGIN_PASSWORD":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:action.data,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_SIGN_UP_EMAIL":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:action.data,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_SIGN_UP_PASSWORD":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:action.data,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_SIGN_UP_USERNAME":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:action.data,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_SIGN_UP_MEMBER_PASSWORD":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:action.data, 
                warningBoxVisible:state.warningBoxVisible,
                warningBox:state.warningBox,
            };
        case "CHANGE_WARNING_BOX":
            return{
                loginFormEmail:state.loginFormEmail,              
                loginFormPassword:state.loginFormPassword,           
                signUpFormEmail:state.signUpFormEmail,             
                signUpFormPassword:state.signUpFormPassword,          
                signUpFormUsername:state.signUpFormUsername,          
                signUpFormMemberPassword:state.signUpFormMemberPassword, 
                warningBoxVisible:action.visibility,
                warningBox:action.data,
            };
        case "CLEAR_FIELDS":
            return{
                loginFormEmail:'',              
                loginFormPassword:'',           
                signUpFormEmail:'',             
                signUpFormPassword:'',          
                signUpFormUsername:'',          
                signUpFormMemberPassword:'',    
            };
        default:
            return state;
    }
};