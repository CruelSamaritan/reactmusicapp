import React from 'react'
import './SearchForm.css'
import {Button} from 'react-bootstrap'
import PropTypes from 'prop-types'


export default class SearchForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        const album = this.props.displayedAlbum;
        const buttons = [];

        let counter = 0;

        Constants.Music.MusicGenres.forEach((genre) => {

            buttons.push(
                <Button onClick={() => {
                    this.props.handleSelectedGenre(genre)
                }} className="genre-button" key={counter++}>{genre}</Button>
            )
        });

        return (

            <div id="covers-top-wrapper">
                {album ?
                    <div className="container-fluid">
                        <div className="col-xs-6 col-sm-5 col-md-4 col-lg-4 clearfix covers-top-column"
                             id="covers-top-img-column">

                                <div className="cover-img-wrapper-top">
                                    <div onClick={() => {
                                        this.props.handleSelectedAlbum(album.artist, album.name)
                                    }} className="covers-hoverable-top img-overlay-top">
                                        <i className="icofont icofont-play-alt-2" aria-hidden="true"></i>
                                    </div>
                                    <img src={album.images.extralarge} className="cover-img-top" alt="Image"/>
                                </div>
                        </div>

                        <div className="col-xs-6 col-sm-7 col-md-8 col-lg-8 clearfix covers-top-column">
                            <div id="cover-top-controls-wrapper">
                                    <section className="cover-top-randomalbum-text">
                                        <h3>Featured:</h3>
                                        <h2 id="cover-top-randomalbum-desc">{`\"${album.name}\" by ${album.artist}`}</h2>
                                    </section>
                                <div id="cover-top-gradient-line-text"></div>
                                <section className="cover-top-genre-buttons">
                                    {buttons}
                                </section>
                                <div id="cover-top-gradient-line-buttons"></div>
                            </div>
                        </div>
                    </div>
                        : null}
            </div>
        )
    }
}

SearchForm.propTypes = {

    displayedAlbum: PropTypes.shape({
        artist: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        images: PropTypes.object.isRequired
    }),
    handleSelectedAlbum: PropTypes.func.isRequired,
    handleSelectedGenre: PropTypes.func.isRequired
};

