const Constants = {

    AlbumSearch: "http://ws.audioscrobbler.com/2.0/?method=album.search&album=believe&api_key=baf276ec219e3b1a6a94f019c27032b4&format=json",
    AlbumInfo: "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=baf276ec219e3b1a6a94f019c27032b4&artist=Gorillaz&album=Plastic+Beach&format=json",

    HTTP: {

      StatusOk: "OK"
    },

    APIKey: "baf276ec219e3b1a6a94f019c27032b4",

    ApiScheme: "https://",
    ApiHost: "ws.audioscrobbler.com",
    ApiPath: "/2.0",
    JSONFormat: "json",


    QueryParameters: {

        QuerySearchApiKey: "api_key",
        QuerySearchMethod: "method",
        QuerySearchAlbum: "album",
        QuerySearchTag: "tag",
        QuerySearchArtist: "artist"
    },


    MusicActions:{

        AlbumsSearch: "ALBUM_SEARCH",
        TopAlbumsForTagSearch: "TOP_ALBUMS_SEARCH",
        AlbumGetInfo: "ALBUM_GET_INFO",
        AlbumFetchFromServer: "ALBUM_GET_INFO_SERVER",
        FetchingAlbumInfo: "ALBUM_FETCHING_INFO",
        TrackGetYTUrl: "TRACK_GET_YT_URL",
        AddAlbumToFavorites: "ALBUM_ADD_FAVORITES",
        RemoveAlbumFromFavorites: "ALBUM_REMOVE_FAVORITES",
        RemoveTrackFromAlbum: "TRACK_REMOVE",
        AddAlbumToCache: "ALBUM_ADD_TO_CACHE",
        GetAlbumFromCache: "ALBUM_GET_FROM_CACHE",
        FailedToFetchAlbumInfo: "ALBUM_FAILED_FETCH"
    },

    Methods: {

        AlbumSearch: "album.search",
        TopAlbumsForTagSearch: "tag.gettopalbums",
        AlbumGetInfo: "album.getinfo"
    },


    JSONResponseKeys: {

        // Config (path to albums in JSON)
        ConfigResults: "results",
        ConfigAlbumMatches: "albummatches",
        ConfigAlbum: "album",
        ConfigAlbums: "albums",


        // Albums data
        AlbumArtistName: "name",
        AlbumArtist: "artist",
        AlbumImages: "image",
        AlbumName: "name",
        AlbumUrl: "url",
        AlbumId: "id",
        AlbumKey: "key",
        AlbumWiki: "wiki",
        AlbumWikiSummary: "summary",
        AlbumTracks: "tracks",
        AlbumTracksArr: "track",

        AlbumImageLink: "#text",
        AlbumImageSize: "size",
        AlbumImagesStatus: "complete"
    },

    Tracks:{
        TrackName: "name",
        TrackUrl: "url"
    },


    Errors: {

      CancelRequest: "Request cancelled by user"
    },

    Interface: {

        InputFormTitle: "Find your vibe"
    },

    Music: {

        MusicGenres: ["New Wave", "80s", "Synthpop", "Pop", "Rock", "Dance", "Hip hop", "Blues",
                        "Classical", "Country", "Indie", "Jazz"]
    },

    Descriptions: {

        NoArtistDescription: "No artist",
        NoAlbumTitleDescription: "No title",
        NoWikiDescription: "There is no description for this album yet.",
        NoTracksDescription: "No tracks for this album yet.",
        AlbumImagePlaceholder: "http://cumbrianrun.co.uk/wp-content/uploads/2014/02/default-placeholder-300x300.png",
        SearchPlaceholder: "look for album"
    },


    LocalServer: {
        ApiScheme: "http://",
        ApiHost: "192.168.1.4:8081",
        ApiPath: "/scrape"
    },

    RemoteServer: {
        ApiScheme: "https://",
        ApiHost: "nodetrackscrape.herokuapp.com",
        ApiPath: "/scrape"
    },

    YouTube: {

        VideoId: "watch?v="
    },

    TrackStatus: {
        Loading: "loading",
        Playing: "playing",
        Stopped: "stopped",
        Corrupted: "corrupted"
    },

    ResponseStatus: {
        Success: "success",
        Failure: "failure"
    }

};

export default Constants;
window.Constants = Constants;
