export default(state,action)=>{
    switch(action.type){
        case "CHANGE_CURRECT_USER":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:action.data,
                friendRequests:state.friendRequests,
            };
        case "CHANGE_SEARCH_BOX":
            return{
                searchBox:action.data,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
            };
        case "CHANGE_SEARCH_RESULTS":
            return{
                searchBox:state.searchBox,      
                searchResults:action.data,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
            };
        case "GET_FRIEND_REQUESTS":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:action.data,
            }
        case "CLEAR_FIELDS":
            return{
                searchBox:'',       
                searchResults:[],   
                currentUser:'',     
                friendRequests:[],  
            }
        default: return state;
    }
}