import React from 'react'
import {Modal, Button}  from 'react-bootstrap'
import PropTypes from 'prop-types';
import './LargeModal.css'
import Video from '../Video/Video.jsx'
import {filterObjectByKey, convertDuration} from "../../helpers/Helpers";


const disallowedProps = ["selectedAlbum", "handleSelectedTrack","YTVideoUrl", "getCurrentVideoTime", "initialRendering"];


function SingleTrack(props){

    const _onClick = () => {
        if (props.trackStatus === Constants.TrackStatus.Corrupted || props.trackStatus === Constants.TrackStatus.Loading){
            return false;
        }
        else{
            props.handleClick();
        }
    };


    const iconControl = () => {

        switch (props.trackStatus) {

            case Constants.TrackStatus.Loading: {
                return "icofont icofont-spinner-alt-2 icofont-spin  modal-play-controls";
            }
            case Constants.TrackStatus.Playing: {
                return "icofont icofont-stop modal-play-controls"
            }
            case Constants.TrackStatus.Stopped: {
                return "icofont icofont-youtube-play modal-play-controls"
            }
            case Constants.TrackStatus.Corrupted: {
                return "icofont icofont-close-circled modal-play-controls"
            }
            default: {
                return "icofont icofont-youtube-play modal-play-controls"
            }
        }
    };

    const classControl = () => {
        let baseClassName = "modal-track-row";
        if(props.trackStatus === Constants.TrackStatus.Corrupted){
            baseClassName = baseClassName + " modal-corrupted-track";
        }
        return baseClassName;
    };

    return (

        <tr onClick={_onClick} className={classControl()}>
            <td>{props.trackNumber}</td>
            <td>{props.trackTitle}</td>
            <td className="modal-table-td-controls">
                <p className={iconControl()}></p>
            </td>
            <td className="modal-table-td-duration">{props.trackDuration}</td>
        </tr>
    );

}

export default class LargeModal extends React.Component{

    constructor(props){

        super(props);
        this.handleSelectedTrack = this.handleSelectedTrack.bind(this);
    }

    handleSelectedTrack(selectedTrack){

        this.props.handleSelectedTrack(selectedTrack);
    };



    render() {

        const _tracks = this.props.selectedAlbum.tracks;
        const _artist = this.props.selectedAlbum.artist;
        const _name = this.props.selectedAlbum.name;
        const _summary = this.props.selectedAlbum.summary;
        const _image = this.props.selectedAlbum.images.extralarge;


        const video = this.props.YTVideoUrl && !this.props.initialRendering ?
                                                            <Video YTVideoUrl={this.props.YTVideoUrl}
                                                                   getCurrentVideoTime={(_currentVideoTime) => {

                                                                       this.props.getCurrentVideoTime(_currentVideoTime);
                                                                 }}
                                                                   cancelButtonVisible={false}
                                                                   startTime={false}
                                                            /> : null;


        // filtrujemy tylke to properties, ktore mozemy podac do <Modal/>
        const filteredProps = filterObjectByKey(this.props, disallowedProps);

        let tracks = [];
        let counter = 0;

        _tracks.forEach((track) =>{

            tracks.push(

                <SingleTrack key={counter++}
                             trackNumber={counter} trackTitle={track.name} trackDuration={convertDuration(track.duration)}

                                handleClick={() => this.handleSelectedTrack({ name: track.name,
                                                                              url: track.url })}
                                trackStatus={track.trackStatus}
                />
            )
        });

        const formattedSummary = _summary.substring(0, _summary.indexOf("<a"));
        const buildSummary = formattedSummary.length ? formattedSummary : Constants.Descriptions.NoWikiDescription;

        const link = _summary.substring(_summary.indexOf("http"), _summary.indexOf(">")-1);
        const buildLink = link.length ? <a href={link} target="_blank">Read more...</a> : null;

        return (
                <Modal {...filteredProps} bsSize="large" aria-labelledby="contained-modal-title-lg">

                        <section id="modal-background-stripes">
                            <div className="modal-background-stripe" id="modal-stripe-one"></div>
                            <div className="modal-background-stripe" id="modal-stripe-two"></div>
                            <div className="modal-background-stripe" id="modal-stripe-three"></div>
                        </section>

                    <Modal.Header closeButton={true}>
                        <Modal.Title id="contained-modal-title-lg">{_artist}</Modal.Title>
                    </Modal.Header>

                        <Modal.Body bsClass="modal-body row">
                                <div className="modal-media-row col-sm-5 col-md-5 col-lg-5">
                                    <img className="modal-cover-img"  src={_image}></img>

                                    <section id="modal-video-section">
                                        {video}
                                    </section>
                                </div>

                                <div className="modal-text-row col-sm-7 col-md-7 col-lg-7">
                                    <section className="modal-album-desc">
                                        <h4 id="modal-album-desc-header">{_name}</h4>
                                        <p id="modal-album-desc-content">{buildSummary} {buildLink}</p>
                                    </section>

                                    <section className="modal-tracklist">
                                        <h4 id="modal-tracklist-header">Tracklist</h4>
                                        <div id="modal-tracks-table-wrapper">
                                            <table id="modal-tracks-table">
                                                <thead>
                                                <tr>
                                                    <th id="modal-table-th-tracknumber"></th>
                                                    <th id="modal-table-th-title"></th>
                                                    <th id="modal-table-th-controls"></th>
                                                    <th id="modal-table-th-duration"></th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                    {tracks}
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                </div>
                        </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>

        );
    }
}

LargeModal.defaultProps = {
    backdrop: false,
    animation: true,
    dialogClassName: "modal-dialog-custom"
};

LargeModal.propTypes = {

    //selectedAlbum: PropTypes.object.isRequired,
    selectedAlbum: PropTypes.shape({
        tracks: PropTypes.array.isRequired,
        artist: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        images: PropTypes.object.isRequired
    }),

    handleSelectedTrack: PropTypes.func.isRequired,
    getCurrentVideoTime: PropTypes.func,
    initialRendering: PropTypes.bool,
    YTVideoUrl: PropTypes.string,
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onExit: PropTypes.func,
    onExited: PropTypes.func,
    backdrop: PropTypes.bool,
    animation: PropTypes.bool,
    dialogClassName: PropTypes.string
};
