export default(state,action)=>{
    switch(action.type){
        case "CHANGE_CURRECT_USER":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUser:action.data,
            };
        case "CHANGE_SEARCH_BOX":
            return{
                searchBox:action.data,      
                searchResults:state.searchResults,
                currentUser:state.currentUser,
            };
        case "CHANGE_SEARCH_RESULTS":
            return{
                searchBox:state.searchBox,      
                searchResults:action.data,
                currentUser:state.currentUser,
            };
        default: return state;
    }
}