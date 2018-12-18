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

const Friends = (props)=>{
    return( 
        <div className="accordion container" id="accordionSec">
            <div className="card">
                {/* Button to open */}
                <div className="card-header text-center" id="headerSec"  style={headerStyle}>
                    <h5 className="mb-0">
                        <button  style={headerButtonStyle} className="btn" data-toggle="collapse" data-target="#collapsSec" aria-expanded="false" aria-controls="collapsSec">
                            Friends
                        </button>
                    </h5>
                </div>
                {/* Friend Requests Data */}
                <div id="collapsSec" className="collapse show" aria-labelledby="headerSec" data-parent="#accordionSec">
                    <div className="card-body">
                        <ul>{mainPanelStore.getState().friends.map((item)=>props.renderTheFriends(item))}</ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Friends;