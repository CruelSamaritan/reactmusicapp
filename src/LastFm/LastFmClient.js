import Constants from '../Constants/Constants'
import buildUrl from 'build-url'
import axios from 'axios'
import {URIFormatSearchObject, getRandomFromArray} from '../helpers/Helpers'


export default class LastFmClient{
    
    static getTrackYTUrl(trackLastFmUrl) {

        // adres do lokalnego serwera Node.js
        //let url = buildUrl(Constants.LocalServer.ApiScheme + Constants.LocalServer.ApiHost, {
        //    path: Constants.LocalServer.ApiPath
        //});

        // adres do zdalnego serwera Node.js
        let url = buildUrl(Constants.RemoteServer.ApiScheme + Constants.RemoteServer.ApiHost, {
            path: Constants.RemoteServer.ApiPath
        });

        axios.get(url,
            {
                //timeout: 8000,
                params: {
                    trackurl: trackLastFmUrl
                }

            }).then((response) =>{
            if (response.status >= 200 && response.status <= 299) {

                dispatcher.dispatch({

                    type: Constants.MusicActions.TrackGetYTUrl,
                    status: Constants.ResponseStatus.Success,
                    payload: {trackYTUrl: response.data,
                              trackUrl: trackLastFmUrl
                            }
                });
            }
        }).catch((err) => {

            dispatcher.dispatch({

                type: Constants.MusicActions.TrackGetYTUrl,
                status: Constants.ResponseStatus.Failure,
                // adres LastFm podany jako arg zostaje zwrocony
                payload: {trackYTUrl: null,
                            trackUrl: trackLastFmUrl
                        }
            });
        });
    }




    // funkcja zwraca obiekt zaw. referencje do funkcji anulujacej request oraz odnaleziona muzyke
    static  getMusicForSearchString(searchObject, searchMethod) {

        const self = this;

        // anuluj dotychczasowe requesty w toku
        if(this.requestCancellingFuncion) {
            this.requestCancellingFuncion(Constants.Errors.CancelRequest);
        }

        let CancelToken = axios.CancelToken;

        let queryParameters = {
            api_key: Constants.APIKey,
            format: Constants.JSONFormat
        };


        switch (searchMethod) {

            case Constants.MusicActions.AlbumsSearch: {

                queryParameters[Constants.QueryParameters.QuerySearchMethod] = Constants.Methods.AlbumSearch;
                queryParameters[Constants.QueryParameters.QuerySearchAlbum] = searchObject.albumName;
                break;
            }

            case Constants.MusicActions.TopAlbumsForTagSearch: {

                let genre = searchObject.musicGenre ? searchObject.musicGenre : getRandomFromArray(Constants.Music.MusicGenres);

                queryParameters[Constants.QueryParameters.QuerySearchMethod] = Constants.Methods.TopAlbumsForTagSearch;
                queryParameters[Constants.QueryParameters.QuerySearchTag] = genre;
                break;
            }

            case Constants.MusicActions.AlbumFetchFromServer: {

                queryParameters[Constants.QueryParameters.QuerySearchMethod] = Constants.Methods.AlbumGetInfo;
                queryParameters[Constants.QueryParameters.QuerySearchArtist] = searchObject.albumArtist;
                queryParameters[Constants.QueryParameters.QuerySearchAlbum] = searchObject.albumName;
                break;
            }
        }


        let url = buildUrl(Constants.ApiScheme + Constants.ApiHost, {
            path: Constants.ApiPath,
            // parametry sa odpowiednio formatowane
            queryParams: URIFormatSearchObject(queryParameters)
        });

        axios.get(url,
            {
                timeout: 5000,
                cancelToken: new CancelToken(function executor(c) {
                    self.requestCancellingFuncion = c;
                })
            }).then((response) =>{
            if (response.status >= 200 && response.status <= 299) {

                dispatcher.dispatch({

                    type: searchMethod,
                    status: Constants.ResponseStatus.Success,
                    payload: response.data
                });
            }
        }).catch((err) => {
            dispatcher.dispatch({

                type: searchMethod,
                status: Constants.ResponseStatus.Failure,
                payload: err
            });
        });
    }
}

