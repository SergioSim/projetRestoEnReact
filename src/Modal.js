import React, { Component } from 'react';
import './Modal.css'
export class Modal extends Component {
    constructor(props){
        super();
        this.state = {
            showHideClassName: props.show ? "modal display-block" : "modal display-none",
        }
    }

    doShow(){
        return( this.props.show ? "themodal display-block" : "themodal display-none");
    }

    render(){
        return (
            <div className={this.doShow()}>
                <section className="modal-main">
                {this.props.children}
                <button onClick={this.props.handleClose} className="btn btn-dark btnpadding">close</button>
                </section>
            </div>
    )}
  };