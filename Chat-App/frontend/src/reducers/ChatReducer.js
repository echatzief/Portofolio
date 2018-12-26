export default(state,action)=>{
    switch(action.type){
        case "SET_USERNAME":
            return{
                username:action.data,
                friendName:state.friendName,
            }
        case "SET_FRIEND":
            return{
                username:state.username,
                friendName:action.data,
            }
        default:
            return state;
    }
}