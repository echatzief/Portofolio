import React from 'react';
import { mainPanelStore } from '../store/mainPanelStore';

const headerStyle ={
    backgroundColor:'#2E7DB5',
}
const headerButtonStyle={
    backgroundColor:'transparent',
    color:'#fff',
    borderColor:'#fff',
}
const searchBox={
    width:'60%',
}
const searchButton={
    marginTop:'3%',
}
const SearchBar = (props)=>{
    return(
        <div className="accordion container" id="searchAccordion">
                        
            <div className="card">
                {/* Button to open */}
                <div className="card-header text-center" id="header" style={headerStyle}>
                    <h5 className="mb-0">
                        <button style={headerButtonStyle} onClick={props.clearSearchInput} className="btn " data-toggle="collapse" data-target="#searchCollapse" aria-expanded="false" aria-controls="searchCollapse">
                            Search
                        </button>
                    </h5>
                </div>
                {/* Search Items */}
                <div id="searchCollapse" className="collapse show" aria-labelledby="header" data-parent="#searchAccordion" >
                    <div className="card-body">

                        {/* Search Box */}
                        <div className="container text-center" style={searchBox}>
                            <input type="text" className="form-control" id="searchBox" value={mainPanelStore.getState().searchBox} onKeyPress={props.searchWithEnter} onChange={props.changeSearchInput} placeholder="Username"/>
                            <div className="container" style={searchButton}><button type="button" className="btn btn-dark" onClick={props.getSearchResults}>Search</button></div>
                        </div>
                    
                        {/* Search Data */}
                        <div>        
                            {mainPanelStore.getState().searchResults.map(((item,i)=>props.createSearchResult(item,i)))}
                        </div>
                        {}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default SearchBar;