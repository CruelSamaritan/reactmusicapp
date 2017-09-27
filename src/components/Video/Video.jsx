import React from 'react'
import PropTypes from 'prop-types';
import './Video.css'
import YouTube from 'react-youtube'

export default class Video extends React.Component{

    constructor(props){
        super(props);

        this.YTObject = null;

        this._onReady = this._onReady.bind(this);
        this.handleVideoClose = this.handleVideoClose.bind(this);
    }


    componentWillUnmount() {
        // wysylamy obecny time wyzej
        if(this.YTObject){
            const currentTime = this.YTObject.getCurrentTime();
            this.props.getCurrentVideoTime(currentTime);
        }
    }


    _onReady(event) {

        this.YTObject =  event.target;
        // zaraz po wgraniu przewijamy do odp. timestamp
        if(this.props.startTime){
            this.YTObject.seekTo(this.props.startTime, true);
        }
    }

    handleVideoClose(event){
        if(this.YTObject){
            this.props.cancelHandler();
        }
    }

    render(){
        const opts = {
            playerVars: {
                autoplay: 1
            }
        };

        const trackPlayingUrl = this.props.YTVideoUrl;
        const indicator = Constants.YouTube.VideoId;
        const index = trackPlayingUrl.indexOf(indicator);

        const videoId = trackPlayingUrl.substr(index + indicator.length);

        return(
                <div className="video-frame embed-responsive embed-responsive-16by9">
                    <YouTube
                        className="modal-video-player embed-responsive-item"
                        videoId={videoId}
                        opts={opts}
                        onReady={this._onReady}
                    />
                    {this.props.cancelButtonVisible ? <i onClick={this.handleVideoClose} className="fa fa-times video-cancel-icon" aria-hidden="true"></i>
                    : null}
                </div>
        )
    }
}

Video.propTypes = {

    getCurrentVideoTime: PropTypes.func
};