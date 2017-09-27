import React from 'react'
import PropTypes from 'prop-types'
import './Backdrop.css'

export default class Backdrop extends React.Component{

    constructor(props){

        super(props)
    }


    render(){

        const handleVisibility = this.props.spinner ? {display: "inline"} : {display: "none"};

        return(

            <div id="backdrop" className="modal-backdrop fade in">
                <div id="fetching-spinner" className="fa fa-circle-o-notch fa-spin" style={handleVisibility}></div>
            </div>
        );
    };
}

Backdrop.propTypes = {

    spinner: PropTypes.bool.isRequired
};