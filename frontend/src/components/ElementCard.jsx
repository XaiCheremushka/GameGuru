import React from "react";
import "../styles/css/element-card.css";


export default class ElementCard extends React.Component {
    title = this.props.title
    description = this.props.description

    render() {
        return (
            <div className="element-card-wrapper">
                <img className="img-element-card" src="" alt=""/>
                <div className="description-element-card-wrapper">
                    <h3 className="title-element-card">{this.title}</h3>
                    <p className="description-element-card">{this.description}</p>
                </div>
            </div>
        )
    }

}