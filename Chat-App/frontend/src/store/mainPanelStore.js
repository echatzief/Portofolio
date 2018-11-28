import {createStore} from 'redux';
import reducer from '../reducers/mainPanelReducer';

const initialState={
    searchBox:'',       /*Search box input */
    searchResults:[],   /* Results of the search */
    currentUser:''      /* Current user */
}

export const mainPanelStore=createStore(reducer,initialState);