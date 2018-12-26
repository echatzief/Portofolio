import React from 'react';
import {ChatStore} from '../store/ChatStore';

var Navbar = (props)=>{
    return(
        <nav className="navbar navbar-dark bg-dark">
            <a className="navbar-brand text-center" href="/">Back to Menu</a>
            <ul class="nav navbar-nav navbar-logo mx-auto">
                <li class="nav-item">
                    <h1 style={{color:'#fff'}}>{ChatStore.getState().friendName}</h1>
                </li>
            </ul>
        </nav>
    );
}
export default Navbar;