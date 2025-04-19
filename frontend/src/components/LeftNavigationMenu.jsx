import React from "react";
import {Link} from "react-router-dom";

import "../styles/css/left-navigation-menu.css";

class LeftNavigationMenu extends React.Component {
    render() {
        return (
            <div id="left-navigation-menu">
                <ul className="nav-menu">
                    <li className="nav-menu-element">
                        <Link to="/categories">Категории</Link>
                    </li>
                    <li className="nav-menu-element">
                        <Link to="/genres/">Жанры</Link>
                    </li>
                    <li className="nav-menu-element">
                        <Link to="/developers/">Разработчики</Link>
                    </li>
                    <li className="nav-menu-element">
                        <Link to="/games/">Игры</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

export default LeftNavigationMenu