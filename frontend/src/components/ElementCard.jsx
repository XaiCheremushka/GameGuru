import React from "react";
import "../styles/css/element-card.css";
import noPhoto from "../assets/items/No_photo.svg";


export default class ElementCard extends React.Component {
    title = this.props.title
    description = this.props.description
    image = this.props.img ? this.props.img : noPhoto

    render() {
        return (
            <div className="element-card-wrapper">
                <img className="img-element-card" src={this.image} alt="alter"/>
                <div className="description-element-card-wrapper">
                    <h3 className="title-element-card">{this.title}</h3>
                    <p className="description-element-card">{this.description}</p>
                </div>
            </div>
        )
    }

}