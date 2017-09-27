import React from 'react'
import './SearchResults.css'
import PropTypes from 'prop-types'

function SingleCover(props){

    const favIconControl = props.favorite ? "fa fa-times fa-favorite-controls" : "fa fa-heart fa-favorite-controls";

    return (
        <div className="col-xs-4 col-sm-3 col-md-2 col-lg-2 covers-single-cover-col">
            <div className="cover-img-wrapper">
                <div onClick={props.onCoverClick} className="covers-hoverable img-overlay">
                    <i className="fa fa-play-circle" aria-hidden="true"></i>
                    <i onClick={props.onFavClick} className={favIconControl} aria-hidden="true"></i>
                </div>
                <img src={props.coverImg} className="cover-img" alt="Image"/>
            </div>
            <section onClick={props.onCoverClick} className="covers-hoverable" id="covers-cover-description">
                <h5 id="covers-cover-artist">{props.artist}</h5>
                <p id="covers-cover-name">{props.name}</p>
            </section>
        </div>
    );
}




export default class SearchResults extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){

        const albums = [];

        this.props.albums.forEach((album) =>{

            albums.push(

                <SingleCover onFavClick={(e) => {e.persist(); e.stopPropagation(); this.props.handleFavClick(album)}}
                             onCoverClick={() => {this.props.handleSelectedAlbum(album.artist, album.name)}}
                             key={album.key}
                             artist={album.artist} name={album.name} coverImg={album.images.large}
                             favorite={album.favorite}
                />
            )
        });

        return(
            <div id="bottom-row-wrapper">
                {albums}
            </div>
        )
    }
}

SearchResults.propTypes = {
    handleSelectedAlbum: PropTypes.func.isRequired,
    handleFavClick: PropTypes.func.isRequired,
    albums: PropTypes.array.isRequired
};