import React from 'react'
import "./Controller.css"
import SearchForm from '../SearchForm/SearchForm.jsx'
import SearchResults from '../SearchResults/SearchResults.jsx'
import MusicStore from '../../stores/MusicStore'
import Constants from '../../Constants/Constants'
import * as MusicActions from "../../actions/MusicAct";
import LargeModal from '../LargeModal/LargeModal.jsx'
import Backdrop from "../Backdrop/Backdrop.jsx";
import Video from '../Video/Video.jsx';
import {getRandomFromArray} from "../../helpers/Helpers.js";
import NavBar from '../NavBar/NavBar.jsx'


const emptyTrack = {
    title:  null,
    url: null,

    YTUrl: null,
    time: 0,
    trackStatus: Constants.TrackStatus.Stopped
};


export default class Controller extends React.Component {



    constructor(props){

        super(props);


        MusicStore.on("change", () => {

            this.inFavorites = false;

            const results = MusicStore.getAll();

            this.setState({
                searchResults: results,
                randomDisplayedAlbum: getRandomFromArray(results)
            })
        });


        MusicStore.on("finishedFetchingTopAlbumsForTag", ()=>{

            this.inFavorites = false;
            const results = MusicStore.getAll();

            this.setState({
                searchResults: results,
                randomDisplayedAlbum: getRandomFromArray(results)
            })
        });


        MusicStore.on("albumSelected", () => {

            this.spinner = false;

            this.setTracks(null, true, false);

            this.setState({
                modalShow: true
            })
        });

        MusicStore.on("albumUpdated", () => {

            this.setTracks(this.state.selectedTrack, false, false);
        });


        MusicStore.on("failedToFetchAlbumInfo", () => {

            this.setState({
                backdrop: false
            })
        });


        // po dodaniu, refresh
        MusicStore.on("changeInFavorites", () => {

            this.setState({
                // w zaleznosci czy jestesmy w favorites, pobieramy odp. dane
                searchResults: this.inFavorites ? MusicStore.getFavoriteAlbums() :  MusicStore.getAll()
            })
        });



        this.inFavorites = false;
        this.initialRenderOfModal = true;
        this.shouldPlayTrackOnMain = false;
        this.spinner = true;

        this.state = {

            randomDisplayedAlbum: null,

            searchResults: [],
            modalShow: false,
            // default'owy obiekt na start (pomocny przy montowaniu modala)
            selectedAlbum: null,
            backdrop: false,

            selectedTrack: emptyTrack
        };

        //this.handleSearch = this.handleSearch.bind(this);
        this.handleSelectedAlbum = this.handleSelectedAlbum.bind(this);
        this.handleSelectedTrack = this.handleSelectedTrack.bind(this);
        this.handleCurrentVideoTime = this.handleCurrentVideoTime.bind(this);
        this.modalExited = this.modalExited.bind(this);
        this.modalExit = this.modalExit.bind(this);
        this.handleSelectedGenre = this.handleSelectedGenre.bind(this);
        this.handleFavClick = this.handleFavClick.bind(this);
        this.handleGetFav = this.handleGetFav.bind(this);
    }


    shouldComponentUpdate(nextProps, nextState){
        return true;
    }


    componentDidMount(){

        // na starcie wygenerujemy i wyswietlimy top albumy dla losowego gatunku
        MusicActions.getTopAlbumsForGenre();
    }

    handleSearch(searchText){

        MusicActions.searchAlbums(searchText);
    };


    handleSelectedAlbum(albumArtist, albumName){

        this.spinner = true;

        this.setState({

            backdrop: true
        });
        MusicActions.getAlbumInfo(albumArtist, albumName);
    }


    handleSelectedTrack(_selectedTrack){

        this.initialRenderOfModal = false;
        this.shouldPlayTrackOnMain = false;

        this.setTracks(_selectedTrack, false, true);
        };


    handleCurrentVideoTime(_currentVideoTime){

        if (this.shouldPlayTrackOnMain){
            const track = this.state.selectedTrack;
            track.time = _currentVideoTime;

            this.setState({
                selectedTrack: track
            })
        }

    }

    handleSelectedGenre(_genre){

        MusicActions.getTopAlbumsForGenre(_genre);
    }


    handleFavClick(album){
        // jesli album jest ulubionym, jest usuwany, lub dodawany w razie jesli nie jest
        album.favorite ? MusicActions.removeAlbumFromFavorites(album) : MusicActions.addAlbumToFavorites(album);
    }


    handleGetFav(){
        this.inFavorites = true;

        this.setState({
            searchResults: MusicStore.getFavoriteAlbums()
        })
    }


    modalExit(){

        // track bedzie odtwarzany tylko, jesli jest aktualnie wybrany / odtwarzany w modalu
        const _shouldPlayTrackOnMain = Boolean(this.state.selectedTrack.YTUrl);
        this.initialRenderOfModal = true;
        this.shouldPlayTrackOnMain = _shouldPlayTrackOnMain &&
            this.state.selectedTrack.trackStatus !== Constants.TrackStatus.Loading;

        if(!this.shouldPlayTrackOnMain){
            this.setState({
                selectedTrack: emptyTrack
            })
        }

        // dodajemy album do lokalnego cache
        MusicActions.addAlbumToLocalCache(this.state.selectedAlbum);
    }


    // dopiero tutaj cykl "bablowania" CurrentVideoTime z Video zostaje zakonczony (aktualny czas jest prawidlowy)
    modalExited(){
        this.setState({
            backdrop: false
        });
    }


    //helper
    setTracks(_selectedTrack, initialSet = false,  shouldSeekYTUrl = false){

        let _selectedAlbum = MusicStore.getSelectedAlbum();

        if(initialSet){

            _selectedAlbum.tracks.forEach((_track) => {
                if(_track.url === this.state.selectedTrack.url &&
                    this.state.selectedTrack.trackStatus === Constants.TrackStatus.Playing){
                    _track.trackStatus = Constants.TrackStatus.Playing;
                }
                else if(_track.trackStatus !== Constants.TrackStatus.Corrupted) {
                    _track.trackStatus = Constants.TrackStatus.Stopped;
                }
            });
        }

        else {

            _selectedAlbum.tracks.forEach(_track => {

                if (_track.url === _selectedTrack.url) {
                    if(_track.trackStatus !== Constants.TrackStatus.Corrupted){

                        if (_track.trackStatus === Constants.TrackStatus.Playing) {
                            _track.trackStatus = Constants.TrackStatus.Stopped;
                            _selectedTrack = emptyTrack;
                        }
                        else if (_track.trackStatus === Constants.TrackStatus.Loading) {
                                _track.trackStatus = _selectedTrack.trackStatus = Constants.TrackStatus.Playing;
                                _selectedTrack.YTUrl = _track.YTUrl;
                        }
                        else {
                            _track.trackStatus = _selectedTrack.trackStatus = Constants.TrackStatus.Loading;
                            if (shouldSeekYTUrl) {
                                MusicActions.getTrackYTUrl(_track.url);
                            }
                        }
                        this.setState({
                            selectedTrack: _selectedTrack
                        });
                    }
                }
                else if (_track.trackStatus !== Constants.TrackStatus.Corrupted) {
                    _track.trackStatus = Constants.TrackStatus.Stopped;
                }
            });
        }

        this.setState({
            selectedAlbum: _selectedAlbum
        });
    }


    render() {

        const video = this.shouldPlayTrackOnMain ? <Video YTVideoUrl={this.state.selectedTrack.YTUrl}
                                                              getCurrentVideoTime={time => this.handleCurrentVideoTime(time)}
                                                              cancelButtonVisible={true}
                                                                // jesli cancelButton jest widoczny, tutaj mozemy go
                                                                // obsluzyc
                                                              cancelHandler={() =>{

                                                                  this.shouldPlayTrackOnMain = false;
                                                                  this.setState(
                                                                  {
                                                                      selectedTrack: emptyTrack
                                                                  }
                                                              )}}
                                                                startTime={this.state.selectedTrack.time}
                                                        /> : null;


        const modalClose = () => this.setState({ modalShow: false });

        const backdrop = this.state.backdrop ? <Backdrop spinner={this.spinner}/> : null;

        const modal = this.state.selectedAlbum ? <LargeModal    selectedAlbum={this.state.selectedAlbum}
                                                                handleSelectedTrack={track => this.handleSelectedTrack(track)}
                                                                getCurrentVideoTime={time => this.handleCurrentVideoTime(time)}
                                                                initialRendering={this.initialRenderOfModal}
                                                                YTVideoUrl={this.state.selectedTrack.YTUrl}

                                                                show={this.state.modalShow}
                                                                onHide={modalClose}
                                                                onExit={this.modalExit}
                                                                onExited={this.modalExited}
                                                                /> : null;

        return (

            <div className="container-fluid" id="controller-main">
                <section id="main-video-section">
                    {video}
                </section>
                {backdrop}
                {modal}

                <section className="row" id="covers-search-container">
                    <NavBar
                        searchText={searchText => this.handleSearch(searchText)}
                        handleGetFav={this.handleGetFav}
                    />
                    <SearchForm displayedAlbum={this.state.randomDisplayedAlbum}
                                handleSelectedGenre={genre => this.handleSelectedGenre(genre)}
                                handleSelectedAlbum={(albumArtist, albumName) => {this.handleSelectedAlbum(albumArtist, albumName)}}
                    />
                </section>

                <section className="row" id="covers-results-container">
                    <SearchResults handleSelectedAlbum={(albumArtist, albumName) => {this.handleSelectedAlbum(albumArtist, albumName)}}
                                   handleFavClick={album => {this.handleFavClick(album)}}
                                   albums={this.state.searchResults}/>
                </section>

            </div>
            )

    }
}