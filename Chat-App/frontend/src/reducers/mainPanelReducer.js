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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
            }
        case "SET_FRIENDS_REQUESTS_ASKED":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
                friendRequestPagesAsked:action.data,
                friendPagesAsked:state.friendPagesAsked,
            }
        case "SET_FRIENDS_ASKED":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
                friendRequests:state.friendRequests,
                friends:state.friends,
                friendRequestsRemainingPages:state.friendRequestsRemainingPages,
                friendRemainingPages:state.friendRemainingPages,
                friendPagesAsked:action.data,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:state.friendPagesAsked,
                friendRequestPagesAsked:state.friendRequestPagesAsked,
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
                friendPagesAsked:0,
                friendRequestPagesAsked:0,
            }
        default: return state;
    }
}