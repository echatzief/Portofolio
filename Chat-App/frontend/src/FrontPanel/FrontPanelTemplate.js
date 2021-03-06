import React,{Component} from 'react';
import { mainPanelStore } from '../store/mainPanelStore';
import SearchBar from './SearchBar';
import FriendRequests from './FriendRequests';
import Friends from './Friends';
import {changeField} from '../actions/mainPanelAct';
import axios from 'axios';
import $ from 'jquery';
import io from 'socket.io-client';

const  results = {
    marginTop:'4%',
}

const greenStatus={
    height: '12px',
    width: '12px',
    backgroundColor: '#42b72a',
    borderRadius: '50%',
    display: 'inline-block',
}

const redStatus={
    height: '12px',
    width: '12px',
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
}
class FrontPanelTemplate extends Component{

    constructor(props){
        super(props);

        /* Open a socket with the backend */
        this.socket=io();

        this.pageLimit=3;
    }

    componentDidMount(){

        /* Clear all the fields */
        mainPanelStore.dispatch(changeField("CLEAR_FIELDS",''));

        var uname=localStorage.getItem('username');
        if(uname==null){
            this.props.history.push('/');
        }
        else{
            console.log("USERNAME: "+uname);
            /* Set the current user */
            mainPanelStore.dispatch(changeField("CHANGE_CURRECT_USER",uname));
        }

        /* Change my activity status */
        this.changeActivity("ACTIVE");

        /* Change to NO ACTIVE when close */
        window.onbeforeunload = function() {
            var username = mainPanelStore.getState().currentUser;
            var status="NO ACTIVE"
            axios.post('/changeActivity',{username,status})
            .then(res=>{
                console.log(res);
                console.log('Activity status changed.');
            })
            return;
         };

        /* Get the pages of friend requests */
        this.getFriendRequestPages();

        /* Get the pages of friends */
        this.getTheFriendsPages();
        /* Refresh friend requests */
        this.socket.on('refreshFriendRequestList',message=>{
            console.log(message);
            if(message.from.trim()===mainPanelStore.getState().currentUser || message.to.trim()===mainPanelStore.getState().currentUser){
                console.log("INside");
                mainPanelStore.dispatch(changeField("SET_FRIENDS_REQUESTS_ASKED",0));
                this.getFriendRequestPages();
            }
        });

        /* Refresh friend list */
        this.socket.on('refreshFriendList',message=>{
            if(message.from.trim()===mainPanelStore.getState().currentUser || message.to.trim()===mainPanelStore.getState().currentUser){
                console.log('Inside Refresh');
                mainPanelStore.dispatch(changeField("SET_FRIENDS_ASKED",0));
                this.getTheFriendsPages();
            }
        });

        /* Change friends list after change status */
        this.socket.on('activityChanged',message=>{
            if(message.trim()!=uname){
                mainPanelStore.dispatch(changeField("SET_FRIENDS_ASKED",0));
                this.getTheFriendsPages();
            }
        });
    }
    /* ---------------------------------------- Friend Requests ----------------------------------*/

    /* Get the request pages */
    getFriendRequestPages = ()=>{

        var username=mainPanelStore.getState().currentUser;
        var pagesLimit=this.pageLimit;

        axios.post('/getFriendRequestPages',{username,pagesLimit})
        .then(res=>{

            console.log("Friend Requests Pages we receive: "+res.data.friendRequestPages);

            /* Set the friend request pages */
            mainPanelStore.dispatch(changeField("SET_FRIEND_REQUESTS_REMAINING_PAGES",res.data.friendRequestPages));
        
            /* Get the friend requests */
            username=mainPanelStore.getState().currentUser;
            pagesLimit=this.pageLimit;
            var requestedPage=mainPanelStore.getState().friendRequestsRemainingPages;
            var wannaNow=mainPanelStore.getState().friendRequestPagesAsked;

            /* We request if page is positive */
            if(res.data.friendRequestPages > wannaNow){
                console.log("We request the page: "+requestedPage);

                axios.post('/getFriendRequest',{username,pagesLimit,requestedPage,wannaNow})
                .then(res=>{

                    /* Save the friend requests */
                    console.log(res.data);
                    mainPanelStore.dispatch(changeField("GET_FRIEND_REQUESTS",res.data));

                    /* Reduce the remaining states */
                    mainPanelStore.dispatch(changeField("SET_FRIENDS_REQUESTS_ASKED",mainPanelStore.getState().friendRequestPagesAsked+1));
                })
            } 
            else{
                mainPanelStore.dispatch(changeField("GET_FRIEND_REQUESTS",[]));
            }
        })
    }

    /* Scroll and get next friend requests */
    scrollandGetFriendRequest(){

        var username=mainPanelStore.getState().currentUser;
        var pagesLimit=this.pageLimit;
        var requestedPage=mainPanelStore.getState().friendRequestsRemainingPages;
        var wannaNow=mainPanelStore.getState().friendRequestPagesAsked;

        axios.post('/getFriendRequest',{username,pagesLimit,requestedPage,wannaNow})
        .then(res=>{
            
            console.log("Friends Requests -- > We request the page: "+requestedPage);
            console.log(res.data);

            /* Push the old ones */
            var allRequests= new Array();
            for(var i=0;i<mainPanelStore.getState().friendRequests.length;i++){
                console.log(mainPanelStore.getState().friendRequests[i]);
                allRequests.push(mainPanelStore.getState().friendRequests[i]);
            }

            /* Push the new ones */
            for(i=0;i<res.data.length;i++){
                allRequests.push(res.data[i]);
            }

            /* Save the friend requests */
            mainPanelStore.dispatch(changeField("GET_FRIEND_REQUESTS",allRequests));

            /* Reduce the remaining states */
            mainPanelStore.dispatch(changeField("SET_FRIENDS_REQUESTS_ASKED",mainPanelStore.getState().friendRequestPagesAsked+1));
        })
    }

    /* Check to fetch friend requests */
    checkToFetch = (e)=>{
        e.preventDefault();
        var div = $('#messageDiv');
        if (div[0].scrollHeight - div.scrollTop() == div.height())
        {
            console.log("Friend Requests Reached Bottom");
            console.log("Remaining: "+mainPanelStore.getState().friendRequestsRemainingPages);
            console.log("Friend Requests asked: "+mainPanelStore.getState().friendRequestPagesAsked);

            if(mainPanelStore.getState().friendRequestPagesAsked < mainPanelStore.getState().friendRequestsRemainingPages ){
                this.scrollandGetFriendRequest();
            }
        }
    }

    /* ---------------------------------------- Friend Requests ----------------------------------*/

    /* --------------------------------------- Handle Friend Requests ----------------------------*/

    /* Remove the friend requests */
    removeRequest = (e) =>{
        console.log("Show Data: "+e.target.id);

        /* Get the two parameters */
        var splitTarget=e.target.id.split(":");
        var usernameWhoMade=splitTarget[0];
        var usernameWhoReceive=splitTarget[1];

        axios.post('/removeRequest',{usernameWhoMade,usernameWhoReceive})
        .then(res=>{
            console.log(res);
        })
    }

    /* Accept or decline the friend request */
    changeStatus = (e,type)=>{

        var splitTarget=e.target.id.split(":");
        var usernameWhoMade=splitTarget[0];
        var usernameWhoReceive=splitTarget[1];

        if(type==="Accept"){
            axios.post('/changeStatus',{type,usernameWhoMade,usernameWhoReceive})
            .then(res=>{
                console.log(res);
            })
        }
        else{
            axios.post('/changeStatus',{type,usernameWhoMade,usernameWhoReceive})
            .then(res=>{
                console.log(res);
            })
        }
    }

    /* --------------------------------------- Handle Friend Requests ----------------------------*/

    /* --------------------------------------- Render Items --------------------------------------*/
    createTheFriendRequestResults = (item)=>{
        var data=item.from+":"+item.to;

        if(item.from===mainPanelStore.getState().currentUser){
            if(item.status==="NOT ACCEPTED"){
                return(
                    <div>
                        <h4>Waiting {item.to} to see your friend request.    
                            <button type="button" id={data} className="btn btn-danger" onClick={this.removeRequest}>Cancel</button>
                        </h4>
                    </div>
                );
            }
            else if(item.status==="ACCEPTED"){
                return(
                    <div>
                        <h4>{item.to} has been your friend from now.  
                            <button type="button" id={data} className="btn btn-danger"  onClick={this.removeRequest} >Remove Note</button>
                        </h4>
                    </div>
                );
            }
            else if(item.status==="DECLINED"){
                return(
                    <div>
                        <h4>{item.username} declined your request.  
                            <button type="button" id={data} className="btn btn-danger"  onClick={this.removeRequest} >Remove Note</button>
                        </h4>
                    </div>
                ); 
            }
        }
        else{
            if(item.status==="NOT ACCEPTED"){
                return(
                    <div>
                        <h4>{item.from} wants to add you as friend.   
                            <button type="button" id={data} className="btn btn-success" onClick={e=>this.changeStatus(e,"Accept")}>Accept</button>
                            <button type="button"  id={data} className="btn btn-danger" onClick={e=>this.changeStatus(e,"Decline")}>Decline</button>
                        </h4>
                    </div>
                );
            }
            else if (item.status==="ACCEPTED"){
                return(
                    <div>
                        <h4> You have accepted the request from {item.from}</h4>
                    </div>
                );
            }
        }
    }

     /* Render the friends */
     renderTheFriends = (item)=>{

        const contStyle={
            marginTop:'2%',
        }

        if(item.status ==="ACTIVE"){
            return(
                <div className="container" style={contStyle}>
                    <div className="row">
                        <div className="col-sm">
                            <span style={greenStatus}></span>
                        </div>
                        <div className="col-sm">
                            {item.username}
                        </div>
                        <div className="col-sm">
                            <button type="button" id={item.username} className="btn btn-danger" onClick={this.removeFriendFromList}>Remove</button>
                        </div>
                        <div className="col-sm">
                            <button type="button" id={item.username} onClick={this.goToChat} className="btn btn-secondary">Chat</button>
                        </div>
                    </div>
                </div>
            );
        }
        else{
            return(
                <div className="container" style={contStyle}>
                    <div className="row">
                        <div className="col-sm">
                            <span style={redStatus}></span>
                        </div>
                        <div className="col-sm">
                            {item.username}
                        </div>
                        <div className="col-sm">
                            <button type="button" id={item.username} className="btn btn-danger" onClick={this.removeFriendFromList}>Remove</button>
                        </div>
                        <div className="col-sm">
                            <button type="button" id={item.username} onClick={this.goToChat} className="btn btn-secondary">Chat</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
    /* --------------------------------------- Render Items --------------------------------------*/

    /* --------------------------------------- Friends -------------------------------------------*/

    getTheFriendsPages = ()=>{

        var username=mainPanelStore.getState().currentUser;
        var pagesLimit=this.pageLimit;

        axios.post('/getFriendPages',{username,pagesLimit})
        .then(res=>{

            console.log("Friend Pages we receive: "+res.data.friendPages);

            /* Set the friend request pages */
            mainPanelStore.dispatch(changeField("SET_FRIEND_REMAINING_PAGES",res.data.friendPages));
        
            /* Get the friend requests */
            username=mainPanelStore.getState().currentUser;
            pagesLimit=this.pageLimit;
            var requestedPage=mainPanelStore.getState().friendRemainingPages;
            var wannaNow=mainPanelStore.getState().friendPagesAsked;

            /* We request if page is positive */
            if(res.data.friendPages > wannaNow){
                console.log("We request the page: "+requestedPage);
                console.log("Counter: "+wannaNow);

                axios.post('/getFriends',{username,pagesLimit,requestedPage,wannaNow})
                .then(res=>{

                    // Save the friendσ 
                    mainPanelStore.dispatch(changeField("SET_FRIENDS",res.data));
                    console.log(res);

                    // Reduce the remaining states 
                    mainPanelStore.dispatch(changeField("SET_FRIENDS_ASKED",mainPanelStore.getState().friendPagesAsked+1));
                })
            } 
            else{
                mainPanelStore.dispatch(changeField("SET_FRIENDS",[]));
            }
        })
    }

    scrollandGetFriends = ()=>{
        var username=mainPanelStore.getState().currentUser;
        var pagesLimit=this.pageLimit;
        var requestedPage=mainPanelStore.getState().friendRemainingPages;
        var wannaNow=mainPanelStore.getState().friendPagesAsked;

        console.log("Counter: "+wannaNow);
        axios.post('/getFriends',{username,pagesLimit,requestedPage,wannaNow})
        .then(res=>{
    
            console.log("Friends --> We request the page: "+requestedPage);

            /* Push the old ones */
            var allRequests= new Array();
            for(var i=0;i<mainPanelStore.getState().friends.length;i++){
                allRequests.push(mainPanelStore.getState().friends[i]);
            }

            /* Push the new ones */
            for(i=0;i<res.data.length;i++){
                allRequests.push(res.data[i]);
            }

            /* Save the friend requests */
            mainPanelStore.dispatch(changeField("SET_FRIENDS",allRequests));

            /* Reduce the remaining states */
            mainPanelStore.dispatch(changeField("SET_FRIENDS_ASKED",mainPanelStore.getState().friendPagesAsked+1));
        })
    }

    /* Check to fetch friend requests */
    checkToFetchFriends = (e)=>{
        e.preventDefault();
        var div = $('#friendsDiv');
        if (div[0].scrollHeight - div.scrollTop() == div.height())
        {
            console.log("Friends Reached Bottom");
            console.log("Remaining: "+mainPanelStore.getState().friendRemainingPages);
            console.log("Friend asked: "+mainPanelStore.getState().friendPagesAsked);

            if(mainPanelStore.getState().friendPagesAsked < mainPanelStore.getState().friendRemainingPages ){
                this.scrollandGetFriends();
            }
        }
    }
    /* Add user as a friend */
    addUserAsFriend = (e)=>{

        /* Get the username of the friend we want to add */
        var usernameOfFriend = e.target.id;
        var myUsername=mainPanelStore.getState().currentUser;
        console.log("Wanna add: "+usernameOfFriend);
        axios.post('/addFriendByUsername',{usernameOfFriend,myUsername})
        .then(res=>{
            console.log(res);
        })
    }

    /* Remove friends from the list */
    removeFriendFromList = (e)=>{
        var myUsername=mainPanelStore.getState().currentUser.trim();
        var friendUsername=e.target.id.trim();

        console.log("Friend: "+friendUsername);

        console.log("Wanna Remove : "+friendUsername);
        axios.post('/removeFriend',{myUsername,friendUsername})
        .then(res=>{
            console.log(res);
        })
    }

    /* --------------------------------------- Friends -------------------------------------------*/
    
    /* --------------------------------------- Search  -------------------------------------------*/
    searchWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.getSearchResults();
        }{/* Friends */}
    }

    /* Get the search results from the server */
    getSearchResults = ()=>{
        
        /* Get the results from server */
        var username=mainPanelStore.getState().searchBox;

        /* Search for different user not yourself */
        if(username!==mainPanelStore.getState().currentUser){
            console.log("Search: "+username);
            axios.post('/getResultsByUsername',{username})
            .then((res)=>{

                if(res.status===204){
                    mainPanelStore.dispatch(changeField("CHANGE_SEARCH_RESULTS",["No Results"]));

                    //Clear search input
                    mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
                }
                else{
                    mainPanelStore.dispatch(changeField("CHANGE_SEARCH_RESULTS",res.data));
                    
                    //Clear search input
                    mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
                }
            })
        }
    }

    /* Render properly the results we get */
    createSearchResult = (item,i)=>{
        if(item==="No Results"){
            return(
                <div className="container text-center" style={results}>
                    <h1>No Results Found.</h1>
                </div>
            );
        }
        else{
            return(
                <div className="container text-center" style={results}>
                    <h2>{item.username} <button type="button" id={item.username} className="btn btn-success" onClick={this.addUserAsFriend}>Add User</button> </h2>
                </div>
            );
        }
    }
    /* --------------------------------------- Search  -------------------------------------------*/

    /* Change my activity status */
    changeActivity = (status)=>{
        var username = mainPanelStore.getState().currentUser;
        axios.post('/changeActivity',{username,status})
        .then(res=>{
            console.log(res);
            console.log('Activity status changed.');
        })
    }
    /* Clear the search box */
    clearSearchInput(){
        mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
        mainPanelStore.dispatch(changeField("CHANGE_SEARCH_RESULTS",[]));
    }
    /* Change the input */
    changeSearchInput=(e)=>{
        mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",e.target.value));
    }

    /* Go to chat */
    goToChat = (e)=>{
        //Save the friend to storage
        localStorage.setItem('friend',e.target.id.trim());
        this.props.history.push('/chat');
    }

    render(){
        return(
            <div>
                <SearchBar
                    clearSearchInput={this.clearSearchInput}
                    searchWithEnter={this.searchWithEnter}
                    changeSearchInput={this.changeSearchInput}
                    getSearchResults={this.getSearchResults}
                    createSearchResult={this.createSearchResult}
                />
                <FriendRequests
                    checkToFetch={this.checkToFetch}
                    createTheFriendRequestResults={this.createTheFriendRequestResults}
                />
                <Friends 
                    renderTheFriends={this.renderTheFriends}
                    checkToFetchFriends={this.checkToFetchFriends}
                />
            </div>
        )
    }
}

export default FrontPanelTemplate;