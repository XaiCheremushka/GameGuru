import React from "react";
import "../styles/css/header.css"
import logo from "../assets/Logo.svg"
import {Link} from "react-router-dom";


class Header extends React.Component {
    render() {
        return (
            <div className="header-wrapper">
                <Link to="/"><img src={logo} alt="Logo" className="header-icon-site"/></Link>
            </div>
        )
    }
}

export default Header