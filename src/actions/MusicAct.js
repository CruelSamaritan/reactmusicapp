import Constants from "../Constants/Constants";
import LastFmClient from '../LastFm/LastFmClient'


// kazda z funkcji / akcji konwertuje najpierw argumenty do obiektu, ktory podaje dalej
export function searchAlbums(searchText){

    const searchObject = {
        albumName: searchText
    };

    LastFmClient.getMusicForSearchString(searchObject, Constants.MusicActions.AlbumsSearch);
}

export function getTopAlbumsForGenre(genre = null){

    const searchObject = {
        musicGenre: genre
    };

    LastFmClient.getMusicForSearchString(searchObject, Constants.MusicActions.TopAlbumsForTagSearch)
}

export function addAlbumToLocalCache(album){

    dispatcher.dispatch({
        type: Constants.MusicActions.AddAlbumToCache,
        payload: album
    })
}

export function getAlbumInfo(albumArtist, albumName){

    const searchObject = {
        albumArtist: albumArtist,
        albumName: albumName
    };

    dispatcher.dispatch({
        type: Constants.MusicActions.AlbumGetInfo,
        payload: searchObject
    })
}

export function addAlbumToFavorites(album){

    dispatcher.dispatch({

        type: Constants.MusicActions.AddAlbumToFavorites,
        payload: album
    });
}

export function removeAlbumFromFavorites(album){

    dispatcher.dispatch({

        type: Constants.MusicActions.RemoveAlbumFromFavorites,
        payload: album
    });
}


export function getTrackYTUrl(trackLastFmUrl){

    LastFmClient.getTrackYTUrl(trackLastFmUrl)
}
