import React,{Component} from 'react';
import { mainPanelStore } from '../store/mainPanelStore';
import {changeField} from '../actions/mainPanelAct';
import axios from 'axios';


const headerStyle ={
    backgroundColor:'#2E7DB5',
}
const headerButtonStyle={
    backgroundColor:'transparent',
    color:'#fff',
    borderColor:'#fff',
}
const friendStyle={
    backgroundColor:'#93b0c9',
}
const searchBox={
    width:'60%',
}
const searchButton={
    marginTop:'3%',
}
const  results = {
    marginTop:'4%',
}


class FrontPanelTemplate extends Component{

    componentDidMount(){

        /* Clear all the fields */
        mainPanelStore.dispatch(changeField("CLEAR_FIELDS",''));

        /* Get the full URL */
        var fullURL=window.location.href;
    
        /* Get the username  from url*/
        var fullURLSplit=fullURL.split("/");
        var uname=fullURLSplit[4].trim();

        /* Set the current user */
        mainPanelStore.dispatch(changeField("CHANGE_CURRECT_USER",uname));
        console.log("Uname: "+uname);
        console.log("Current user: "+mainPanelStore.getState().currentUser);
        /* Get the friend requests */
        this.getTheFriendRequests();
        /* Get the active ones */
        /* Get the friends */
    }

    searchWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.getSearchResults();
        }
    }

    getTheFriendRequests = ()=>{

        /* Request the backend to send all my friend requests */
        var username=mainPanelStore.getState().currentUser;
        axios.post('/getFriendRequest',{username})
        .then(res=>{
            console.log(res);

            /* Save the friend requests */
            mainPanelStore.dispatch(changeField("GET_FRIEND_REQUESTS",res.data));
            console.log("Requests: ");
            console.log(mainPanelStore.getState().friendRequests);
        })
    }

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

    createTheFriendRequestResults = (item)=>{
        var data=item.from+":"+item.username;
        if(item.from===mainPanelStore.getState().currentUser){
            if(item.status==="NOT ACCEPTED"){
                return(
                    <div>
                        <h4>Waiting {item.username} to see your friend request.    
                            <button type="button" id={data} className="btn btn-danger" onClick={this.removeRequest}>Cancel</button>
                        </h4>
                    </div>
                );
            }
            else if(item.status==="ACCEPTED"){
                return(
                    <div>
                        <h4>{item.username} has been your friend from now.  
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
        }
    }
    getTheActiveOnes = ()=>{

    }

    getTheFriends = ()=>{

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
   
    render(){
        return(
            <div>
                {/* Search */}
                <div className="accordion container" id="searchAccordion">
                    
                    <div className="card">
                        {/* Button to open */}
                        <div className="card-header text-center" id="header" style={headerStyle}>
                            <h5 className="mb-0">
                                <button style={headerButtonStyle} onClick={this.clearSearchInput} className="btn " data-toggle="collapse" data-target="#searchCollapse" aria-expanded="false" aria-controls="searchCollapse">
                                    Search
                                </button>
                            </h5>
                        </div>
                        {/* Search Items */}
                        <div id="searchCollapse" className="collapse show" aria-labelledby="header" data-parent="#searchAccordion" >
                            <div className="card-body">

                                {/* Search Box */}
                                <div className="container text-center" style={searchBox}>
                                    <input type="text" className="form-control" id="searchBox" value={mainPanelStore.getState().searchBox} onKeyPress={this.searchWithEnter} onChange={this.changeSearchInput} placeholder="Username"/>
                                    <div className="container" style={searchButton}><button type="button" className="btn btn-dark" onClick={this.getSearchResults}>Search</button></div>
                                </div>
                            
                                {/* Search Data */}
                                <div>        
                                    {mainPanelStore.getState().searchResults.map(((item,i)=>this.createSearchResult(item,i)))}
                                </div>
                                {}
                            </div>
                        </div>

                    </div>

                </div>
                {/* Friend Requests */}
                <div className="accordion container" id="accordion">
                    <div className="card">
                        {/* Button to open */}
                        <div className="card-header text-center" id="header" style={headerStyle}>
                            <h5 className="mb-0">
                                <button style={headerButtonStyle} className="btn " data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    Friend Requests
                                </button>
                            </h5>
                        </div>
                        {/* Friend Requests Data */}
                        <div id="collapseOne" className="collapse show" aria-labelledby="header" data-parent="#accordion" >
                            <div className="card-body">
                               <ul>{mainPanelStore.getState().friendRequests.map((item)=>this.createTheFriendRequestResults(item))}</ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Active Ones */}
                <div className="accordion container" id="accordionSec">
                    <div className="card">
                        {/* Button to open */}
                        <div className="card-header text-center" id="headerSec"  style={headerStyle}>
                            <h5 className="mb-0">
                                <button  style={headerButtonStyle} className="btn" data-toggle="collapse" data-target="#collapsSec" aria-expanded="false" aria-controls="collapsSec">
                                    Active 
                                </button>
                            </h5>
                        </div>
                        {/* Friend Requests Data */}
                        <div id="collapsSec" className="collapse show" aria-labelledby="headerSec" data-parent="#accordionSec">
                            <div className="card-body">
                                Hi.
                            </div>
                        </div>
                    </div>
                </div>
                {/* Friends */}
                <div className="container">
                    <div style={friendStyle}>
                        <p>Friends</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default FrontPanelTemplate;