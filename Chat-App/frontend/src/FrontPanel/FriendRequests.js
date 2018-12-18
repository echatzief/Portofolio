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
const FriendRequests = (props)=>{
    return(
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
                <div id="collapseOne" className="collapse show" aria-labelledby="header" data-parent="#accordion">

                    <div id="messageDiv" style={{height:'50px',overflowY:'auto'}} onScrollCapture={props.checkToFetch}>
                        {mainPanelStore.getState().friendRequests.map((item)=>props.createTheFriendRequestResults(item))}
                    </div>    
                </div>
            </div>
        </div>
    );
}
export default FriendRequests;