import React from 'react'
import './NavBar.css'
import {FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap'
import PropTypes from 'prop-types'

export default class NavBar extends React.Component{

    constructor(props){
        super(props);

        this.handleInput = this.handleInput.bind(this);
        this.handleGetFav = this.handleGetFav.bind(this);
    }


    handleInput(){
        //const text = e.target.value;
        const inputValue = this.input.value;
        if(inputValue.length){
            this.props.searchText(this.input.value);
        }

    }

    handleGetFav(){

        this.props.handleGetFav();
    }


    render(){

        return(

            <div id="top-controls-wrapper">
                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                </div>

                <div className="col-xs-8 col-sm-8 col-md-6 col-lg-6 clearfix">
                    <form onSubmit={(e) => {e.preventDefault(); this.handleInput()}}>
                        <FormGroup bsClass="form-group search-form-group">
                            <InputGroup bsClass="input-group search-form-input-group">
                                <FormControl inputRef={ref => { this.input = ref; }}  bsClass="form-control search-form-input" type="text"
                                             placeholder={Constants.Descriptions.SearchPlaceholder} />
                                <InputGroup.Addon onClick={this.handleInput}  bsClass="input-group-addon search-form-addon">
                                    <i className="icofont icofont-search"></i>
                                </InputGroup.Addon>
                            </InputGroup>
                        </FormGroup>
                    </form>
                </div>

                <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3">
                    <section className="cover-top-misc-buttons">
                        <a href="#" onClick={this.handleGetFav} className="cover-top-links fa fa-heart-o"
                           id="favorite-link"></a>
                    </section>
                </div>
            </div>
        )
    }
}

NavBar.propTypes = {
    searchText: PropTypes.func.isRequired,
    handleGetFav: PropTypes.func.isRequired
};