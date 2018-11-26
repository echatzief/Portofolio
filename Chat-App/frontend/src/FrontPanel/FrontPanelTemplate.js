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
        console.log("Current user email: "+mainPanelStore.getState().currentUserEmail);
        /* Get the friend requests */
        /* Get the active ones */
        /* Get the friends */
    }

    searchWithEnter = (e)=>{
        if(e.key==='Enter'){
            this.getSearchResults();
        }
    }

    clearSearchInput(){
        mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
    }
    changeSearchInput=(e)=>{
        mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",e.target.value));
        console.log("Search: "+mainPanelStore.getState().searchBox);
    }

    getSearchResults = ()=>{
        
        /* Get the results from server */
        var username=mainPanelStore.getState().searchBox;
        console.log("Search: "+username);
        axios.post('/getResultsByUsername',{username})
        .then((res)=>{

            if(res.status==204){
                mainPanelStore.dispatch(changeField("CHANGE_SEARCH_RESULTS",["No Results"]));

                //Clear search input
                mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
            }
            else{
                mainPanelStore.dispatch(changeField("CHANGE_SEARCH_RESULTS",res.data));
                
                //Clear search input
                mainPanelStore.dispatch(changeField("CHANGE_SEARCH_BOX",''));
                console.log(res.data);
            }
        })
    }
    
    createSearchResult = (item,i)=>{
        if(item=="No Results"){
            return(
                <div className="container text-center" style={results}>
                    <h1>No Results Found.</h1>
                </div>
            );
        }
        else{
            return(
                <div className="container text-center" style={results}>
                    <h2>{item.username} <button type="button" id={item.username} className="btn btn-success">Add User</button> </h2>
                </div>
            );
        }
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
                                <button style={headerButtonStyle} className="btn " data-toggle="collapse" data-target="#searchCollapse" aria-expanded="false" aria-controls="searchCollapse">
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
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
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
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
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