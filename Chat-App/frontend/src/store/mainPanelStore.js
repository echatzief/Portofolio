import {createStore} from 'redux';
import reducer from '../reducers/mainPanelReducer';

const initialState={
    searchBox:'',       /*Search box input */
    searchResults:[],   /* Results of the search */
    currentUser:'',     /* Current user */
    friendRequests:[],   /* Friend Requests */
    friends:[],         /* Friends we have */
    friendRequestsRemainingPages:0, /* Pages of friend requests */
    friendRemainingPages:0          /* Pages of friends */
}

export const mainPanelStore=createStore(reducer,initialState);