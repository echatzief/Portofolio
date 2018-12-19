export default(state,action)=>{
    switch(action.type){
        case "CHANGE_CURRECT_USER":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:action.data,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
            };
        case "CHANGE_SEARCH_BOX":
            return{
                searchBox:action.data,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
            };
        case "CHANGE_SEARCH_RESULTS":
            return{
                searchBox:state.searchBox,      
                searchResults:action.data,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
            };
        case "GET_FRIEND_REQUESTS":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:action.data,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
            }
        case "SET_FRIENDS":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:action.data,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
            }
        case "SET_FRIEND_REQUESTS_REMAINING_PAGES":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:action.data,
                friendRemainingPages:state.friendRemainingPages,
            }
        case "SET_FRIEND_REMAINING_PAGES":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:action.data,
            }
        case "CLEAR_FIELDS":
            return{
                searchBox:'',       
                searchResults:[],   
                currentUser:'',     
                friendRequests:[], 
                friends:[],
                friendRequestsRemainingPages:0,
                friendRemainingPages:0,
            }
        default: return state;
    }
}