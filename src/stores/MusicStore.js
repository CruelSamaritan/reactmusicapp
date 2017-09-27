import EventEmitter from 'events'
import dispatcher from '../dispatchers/Dispatcher'
import Constants from "../Constants/Constants";
import Album from '../LastFm/Album'
import {arrContainsAlbum} from '../helpers/Helpers'
import LastFmClient from '../LastFm/LastFmClient'

class MusicStore extends EventEmitter{

    constructor() {
        super();

        this.results = [];
        this.selectedAlbum = {};
        this.trackYTUrl = null;
        this.favoriteAlbums = [];
        this.cachedAlbums = [];
    }



    handleReceivedActions(action){

        switch(action.type){

            case Constants.MusicActions.AlbumsSearch:{

                this.results = Album.albumsFromSearchResults(action.payload);
                this.markAlbumsAsFavorite(true);
                this.emit("change");
                break;
            }

            case Constants.MusicActions.TopAlbumsForTagSearch:{

                this.results = Album.topAlbumsForGenre(action.payload);
                this.markAlbumsAsFavorite(true);
                this.emit("finishedFetchingTopAlbumsForTag");
                break;
            }

            case Constants.MusicActions.AddAlbumToCache:{

                const album = action.payload;

                if(!arrContainsAlbum(album, this.cachedAlbums)){
                    this.cachedAlbums.push(album);
                }
                break;
            }

            case Constants.MusicActions.AlbumGetInfo:{
                //najpierw przeszukac lokalny cache
                const albumArtist = action.payload.albumArtist;
                const albumName = action.payload.albumName;

                let foundInCache = false;

                for (let album of this.cachedAlbums){
                    if(album.name === albumName && album.artist === albumArtist){
                        this.selectedAlbum = album;
                        foundInCache = true;
                        this.emit("albumSelected");
                    }
                }
                if(!foundInCache){
                    LastFmClient.getMusicForSearchString(action.payload, Constants.MusicActions.AlbumFetchFromServer);
                }

                break;
            }


            case Constants.MusicActions.AlbumFetchFromServer:{

                if(action.status === Constants.ResponseStatus.Success){
                    this.selectedAlbum = Album.albumDetailedInfo(action.payload);
                    this.emit("albumSelected");
                }
                else{
                    this.emit("failedToFetchAlbumInfo");
                }
                break;
            }


            case Constants.MusicActions.TrackGetYTUrl:{

                // moze byc null
                const trackYTUrl = action.payload.trackYTUrl;
                const trackUrl = action.payload.trackUrl;
                // jesli success, jest to link do YT, jesli nie, dostajemy z powrotem link do LastFm
                for (let track of this.selectedAlbum.tracks){

                    if (track.url === trackUrl) {
                        if(action.status === Constants.ResponseStatus.Success){
                            track.YTUrl = trackYTUrl;
                        }
                        else{
                            track.trackStatus = Constants.TrackStatus.Corrupted;
                        }
                        this.emit("albumUpdated");
                        break;
                    }
                }

                break;
            }


            case Constants.MusicActions.AddAlbumToFavorites:{

                const favAlbum = action.payload;

                // ref do obiektu
                favAlbum.favorite = true;

                if(!arrContainsAlbum(favAlbum, this.favoriteAlbums)){
                    this.favoriteAlbums.push(favAlbum);
                    this.emit("changeInFavorites");
                }
                break;
            }


            case Constants.MusicActions.RemoveAlbumFromFavorites:{
                    const unFavAlbum = action.payload;
                    let index = 0;

                    for(let favAlbum of this.favoriteAlbums){
                        if (unFavAlbum.url === favAlbum.url) {
                            // ref do obiektu
                            unFavAlbum.favorite = false;
                            this.favoriteAlbums.splice(index, 1);
                            this.emit("changeInFavorites");
                            break;
                        }
                        index++;
                    }
                    break;
            }
        }
    }



    getAll(){
        return this.results;
    }

    getSelectedAlbum(){
        return this.selectedAlbum;
    }

    getFavoriteAlbums(){

        return this.favoriteAlbums;
    }



    markAlbumsAsFavorite(favBool){
        this.results.forEach((album)=>{
           this.favoriteAlbums.forEach((favAlbum) => {

               if (favAlbum.url === album.url){
                   album.favorite = favBool;
               }
           })
        });
    }

}

const musicStore = new MusicStore();
window.musicStoreDispatchToken = dispatcher.register(musicStore.handleReceivedActions.bind(musicStore));
window.dispatcher = dispatcher;

export default musicStore;