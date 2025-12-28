
import React from "react";
import "../../styles/css/header.css"
import logo from "../../assets/Logo.svg"
import menu from "../../assets/navigation/menu.svg"
import {Link} from "react-router-dom";
import MobileNavigationMenu from "./MobileNavigationMenu.jsx";

class Header extends React.Component {
    render() {
        return (
            <>
                <div className="header-wrapper">
                    <div className="header-block">
                        <div className={'item-buffer'}></div>
                        <Link to="/"><img src={logo} alt="Logo" className="header-icon-site"/></Link>
                        <div className={'item-buffer'}>
                            <button className={'burger-mobile-nav-menu'}>
                                <img src={menu} alt="Menu" className="header-icon-menu"/>
                            </button>
                        </div>
                    </div>
                </div>

                <MobileNavigationMenu />
            </>
        )
    }
}

export default Header
