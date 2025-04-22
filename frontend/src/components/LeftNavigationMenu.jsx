import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/css/left-navigation-menu.css";

class LeftNavigationMenu extends React.Component {
    render() {
        const { pathname } = this.props.location;

        return (
            <div id="left-navigation-menu">
                <ul className="nav-menu">
                    <li className={`nav-menu-element ${pathname === '/categories' ? 'menu-element--active' : ''}`}>
                        <Link to="/categories">Категории</Link>
                    </li>
                    <li className={`nav-menu-element ${pathname === '/genres' ? 'menu-element--active' : ''}`}>
                        <Link to="/genres">Жанры</Link>
                    </li>
                    <li className={`nav-menu-element ${pathname === '/developers' ? 'menu-element--active' : ''}`}>
                        <Link to="/developers">Разработчики</Link>
                    </li>
                    <li className={`nav-menu-element ${pathname === '/games' ? 'menu-element--active' : ''}`}>
                        <Link to="/games">Игры</Link>
                    </li>
                </ul>
            </div>
        )
    }
}

// Обертка для использования хука useLocation
function LeftNavigationMenuWithRouter(props) {
    const location = useLocation();
    return <LeftNavigationMenu {...props} location={location} />;
}

export default LeftNavigationMenuWithRouter;