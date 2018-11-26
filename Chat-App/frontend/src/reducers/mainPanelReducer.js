export default(state,action)=>{
    switch(action.type){
        case "CHANGE_CURRECT_USER":
            return{
                searchBox:state.searchBox,      
                searchResults:state.searchResults,
                currentUserEmail:action.data,
            };
        case "CHANGE_SEARCH_BOX":
            return{
                searchBox:action.data,      
                searchResults:state.searchResults,
                currentUserEmail:state.currentUserEmail,
            };
        case "CHANGE_SEARCH_RESULTS":
            return{
                searchBox:state.searchBox,      
                searchResults:action.data,
                currentUserEmail:state.currentUserEmail,
            };
        default: return state;
    }
}