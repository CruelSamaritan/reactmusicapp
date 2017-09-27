
import Constants from "../Constants/Constants";
import {getRandomIntInclusive} from '../helpers/Helpers.js'

export default class Album{

    constructor(album) {
        // this.artist = album[Constants.JSONResponseKeys.AlbumArtist];
        // jesli key "artist" to obiekt, wyciagamy go, jesli nie, pobieramy tylko value
        this.artist = function(){
            if (typeof album[Constants.JSONResponseKeys.AlbumArtist] === "object"){

                return album[Constants.JSONResponseKeys.AlbumArtist][Constants.JSONResponseKeys.AlbumArtistName]
            }
            else return album[Constants.JSONResponseKeys.AlbumArtist]
        }();

        this.name = album[Constants.JSONResponseKeys.AlbumName];

        this.url = album[Constants.JSONResponseKeys.AlbumUrl];
        this.images = this.getImages(album[Constants.JSONResponseKeys.AlbumImages]);
        this.id = album[Constants.JSONResponseKeys.AlbumId];
        this.key = album[Constants.JSONResponseKeys.AlbumKey];
        this.summary = typeof album[Constants.JSONResponseKeys.AlbumWiki] === "object" ? album[Constants.JSONResponseKeys.AlbumWiki][Constants.JSONResponseKeys.AlbumWikiSummary]:
                                Constants.Descriptions.NoWikiDescription;
        this.tracks = typeof album[Constants.JSONResponseKeys.AlbumTracks] === "object" ? album[Constants.JSONResponseKeys.AlbumTracks][Constants.JSONResponseKeys.AlbumTracksArr]:
                                Constants.Descriptions.NoTracksDescription;

    }

    static albumsFromSearchResults(dataObject){

        const albums = dataObject[Constants.JSONResponseKeys.ConfigResults]
                                    [Constants.JSONResponseKeys.ConfigAlbumMatches]
                                        [Constants.JSONResponseKeys.ConfigAlbum];

        return Album.createArrayOfAlbums(albums);
    }


    static topAlbumsForGenre(dataObject){

        const albums = dataObject[Constants.JSONResponseKeys.ConfigAlbums]
                                    [Constants.JSONResponseKeys.ConfigAlbum];

        return Album.createArrayOfAlbums(albums);
    }


    static albumDetailedInfo(dataObject){

        const album = dataObject[Constants.JSONResponseKeys.ConfigAlbum];

        return Album.createSingleDetailedAlbum(album);
    }





    static createSingleDetailedAlbum(album){

        return new Album(album);
    }



    static createArrayOfAlbums(albums){

        let albumObjectsArray = [];

        let id = 0;
        albums.forEach((album) => {

            album.id = id++;
            // TODO
            album.key = getRandomIntInclusive(1, 999999);
            albumObjectsArray.push(new Album(album));
        });
        // sortujemy tak, by albumy niekompletne byly na koncu tabeli
        albumObjectsArray.sort((a) => {

            let comparison = 0;
            a.images.complete === false ? comparison = 1 : comparison = -1;
            return comparison;
        });

        return albumObjectsArray;
    }



    // funkcja zwraca obiekt z rozmiarami oraz adresami grafik
    getImages(images){

        const result = {
            complete: false
        };

        images.forEach((image)=> {

            // jesli nie ma podanego linka (property "#text" jest puste), podajemy placeholder
            if(image[Constants.JSONResponseKeys.AlbumImageLink] !== ""){
                if(!result.complete) result.complete = true;
                result[image[Constants.JSONResponseKeys.AlbumImageSize]] = image[Constants.JSONResponseKeys.AlbumImageLink]
            }
            else result[image[Constants.JSONResponseKeys.AlbumImageSize]] = Constants.Descriptions.AlbumImagePlaceholder;
        });

        return result
    }

}