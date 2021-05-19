//REACT
import React, { useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { useParams, useHistory } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CRow,
  CInput,
  CProgress,
  CButton,
  CDropdown,
  CCard,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSelect,
  CCol,
  CCardBody,
  CCardText,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//Style
import "../styles/nintube.css";
//API
import { getVideo, getPlaylistView, API_URL } from "../../../util/Api";
import ReactPlayer from "react-player";
import { useWindowSize } from "@react-hook/window-size/throttled";
import screenfull from "screenfull";

const Player = ({ url = "" }) => {
  let history = useHistory();
  let { id, playlistid } = useParams();
  const ref = React.createRef();
  const [window_width, window_height] = useWindowSize({ fps: 60 });
  const [state, setState] = useState({
    fetched: false,
    volume: 0.5,
    playing: false,
    playbackRate: 1.0,
    file: "",
    muted: false,
    video_id: id,
    hidden: false,
    videos_id: [],
  });
  const [loaded, setLoaded] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);

  const [playlist, setPlaylist] = useState({
    videos: [],
    title: "",
    index_select: 0,
    video_select: id,
    channel_id: "",
    channel_name: "",
  });

  var back_data = [
    {
      id: 0,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 1,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: "acaf6249-cca8-4a90-bac1-9133b7ea1adb",
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 3,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 4,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 5,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 6,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 7,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 8,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 9,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 10,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 11,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 12,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 13,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 14,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 15,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 16,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 17,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 18,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 19,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 20,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 21,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 22,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 23,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 24,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 25,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
    {
      id: 26,
      thumb:
        "https://i.ytimg.com/vi/eXASPM9CyH0/hqdefault.jpg?sqp=-oaymwEjCNACELwBSFryq4qpAxUIARUAAAAAGAElAADIQj0AgKJDeAE=&rs=AOn4CLDdSPNAYKm5nowMhTcZFcQu7c7l3g",
      title: "Titulo",
      channel: "Nome do Canal",
    },
  ];

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };

  const handleClickFullscreen = () => {
    screenfull.request(findDOMNode(ref.current));
  };

  const handleVolumeChange = (value) => {
    setState({
      ...state,
      volume: value ? value : state.volume,
      muted: value ? false : true,
    });
  };

  const handleSetPlaybackRate = (e) => {
    setState({ ...state, playbackRate: parseFloat(e.target.value) });
  };

  const handleProgress = (stat) => {
    if (!seeking) {
      setPlayed(stat.played);
      var play = stat.played;
      if (play === 1) {
        if (playlist.index_select !== playlist.videos.length - 1) {
          history.push(
            "/viewPlaylist/" +
              playlistid +
              "/" +
              playlist.videos[playlist.index_select + 1].video_id
          );
          window.location.reload();
        }
      }
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    ref.current.seekTo(parseFloat(e.target.value));
  };

  useEffect(() => {
    // var size = useWindowSize();
    if (!state.fetched && url === "") {
      var data = {
        video_id: id,
      };
      getVideo(data)
        .then(function (data) {
          setState({ ...state, fetched: true, file: data.file });
        })
        .catch((err) => {
          setState({ ...state, fetched: true });
          alert("Houve um problema", "Por favor recarregue a pagina", [
            {
              label: "Recarregar",
              onClick: () => {
                window.location.reload();
              },
            },
            // {
            //   label: "Login",
            //   onClick: () => {
            //     history.push("/login");
            //   },
            // },
          ]);
        });

      getPlaylistView({ playlist_id: playlistid })
        .then(function (data) {
          var select = "";
          data.videos.map((video, index) => {
            if (video.video_id === id) {
              select = index;
            }
          });
          setPlaylist({
            ...playlist,
            videos: data.videos,
            title: data.data.title,
            channel_id: data.data.channel_id,
            channel_name: data.data.channel,
            index_select: select,
          });
        })
        .catch((err) => {
          setState({ ...state, fetched: true });
          alert("Houve um problema", "Por favor recarregue a pagina", [
            {
              label: "Recarregar",
              onClick: () => {
                window.location.reload();
              },
            },
            // {
            //   label: "Login",
            //   onClick: () => {
            //     history.push("/login");
            //   },
            // },
          ]);
        });
    }
  }, []);
  useEffect(() => {
    if (url !== "") {
      setState({ ...state, file: url });
    }
  }, [url]);

  return (
    //
    <div style={{ display: "flex", width: "100%" }}>
      {state.file !== "" ? (
        <div className="divVideo" style={{ width: "68%" }}>
          <div
            className="player-wrapper"
            style={{
              cursor: "pointer",
              //border: "3px solid red",
            }}
            onClick={() => handlePlayPause()}
          >
            <ReactPlayer
              className="react-player"
              ref={ref}
              style={{}}
              url={state.file}
              // width="1000px"
              // height="563px"
              width="100%"
              height="100%"
              // width="860px"
              // height="420px"
              // width={window_width - 1000}
              // height={window_height - 500}
              muted={state.muted}
              playing={state.playing}
              volume={state.volume}
              playbackRate={state.playbackRate}
              onProgress={handleProgress}
              onDuration={handleDuration}
              // controls={true}
            />
          </div>
          <div
            style={{
              borderTop: "1px solid black",
              // display: "flex",
              // width: "100%",
              // height: "100%",
              // position: "relative",
            }}
          >
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              style={{
                width: "100%",
                marginTop: "auto",
              }}
            />
          </div>
          <div
            width="100%"
            height="100%"
            style={{
              display: "flex",
              //backgroundColor: "rgb(38, 36, 82)",
            }}
          >
            {" "}
            <div
              onClick={() => handlePlayPause()}
              style={{
                //padding: "7px",
                //marginLeft: "1%",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "1%",
                //backgroundColor: "red",
                //border: "1px inset black",
                width: "6%",
                height: "35px",
                //color: "white",
              }}
            >
              {state.playing ? (
                <CIcon name="cilMediaPause" />
              ) : (
                <CIcon name="cilMediaPlay" />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //color: "white",
              }}
            >
              {state.muted === true ? (
                <CIcon
                  name="cilVolumeOff"
                  onClick={() => handleVolumeChange(state.volume)}
                />
              ) : null}
              {state.muted === false && state.volume <= 0.5 ? (
                <CIcon
                  name="cilVolumeLow"
                  onClick={() => handleVolumeChange(0)}
                />
              ) : null}
              {state.muted === false && state.volume > 0.5 ? (
                <CIcon
                  name="cilVolumeHigh"
                  onClick={() => handleVolumeChange(0)}
                />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
              }}
            >
              <input
                style={{ width: "50%", marginLeft: "1%" }}
                type="range"
                min={0}
                max={1}
                step="any"
                value={state.volume}
                onChange={(e) => handleVolumeChange(e.target.value)}
              />
            </div>
            <div
              style={{
                marginLeft: "auto",
                width: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></div>
            <div
              style={{
                width: "30%",
                marginLeft: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //color: "white",
              }}
            >
              <CButton onClick={handleClickFullscreen}>Fullscreen</CButton>
              <span style={{ marginRight: "1%" }}> Velocidade </span>
              <div>
                <CSelect onChange={(e) => handleSetPlaybackRate(e)}>
                  <option value="0.25">0.25</option>
                  <option value="0.5">0.5</option>
                  <option value="0.75">0.75</option>
                  <option value="1" selected>
                    1
                  </option>
                  <option value="1.25">1.25</option>
                  <option value="1.5">1.5</option>
                  <option value="1.75">1.75</option>
                  <option value="2">2</option>
                </CSelect>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          // className="c-app c-default-layout"
          style={{
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      {playlist.videos.length !== 0 ? (
        <div style={{ marginLeft: "auto", width: "25%" }}>
          <div
            style={{
              marginBottom: "3%",
              border: "1px solid white",
              borderRadius: "20px",
              padding: "10px",
            }}
          >
            <CRow>
              <CCol sm="10">
                <h3 style={{ color: "white" }}>{playlist.title}</h3>{" "}
                <span style={{ color: "white" }}>
                  {" "}
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      history.push("/channel/" + playlist.channel_id)
                    }
                  >
                    {playlist.channel_name}{" "}
                  </span>{" "}
                  - {playlist.index_select + 1}/{playlist.videos.length}
                </span>
              </CCol>
              <CCol
                sm="2"
                style={{
                  display: "flex",
                  textAlign: "center",
                  verticalAlign: "center",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <span
                  style={{
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => setState({ ...state, hidden: !state.hidden })}
                >
                  {state.hidden ? (
                    <CIcon name="cilChevronBottom" />
                  ) : (
                    <CIcon name="cilChevronTop" />
                  )}
                </span>
              </CCol>
            </CRow>
          </div>
          <div
            hidden={state.hidden}
            className="scroll"
            style={{
              height: "500px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "nowrap",
              overflowY: "scroll",
              border: "2px solid white",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            {playlist.videos.map((video, index) => (
              <CCard
                key={"card-" + video.video_id}
                onClick={
                  () => {
                    // setState({ ...state, video_id: video.video_id });
                    // setPlaylist({ ...playlist, index_select: index });
                    history.push(
                      "/viewPlaylist/" + playlistid + "/" + video.video_id
                    );
                    window.location.reload();
                  }
                  // handleClick("view", video.id)
                }
                style={{
                  cursor: "pointer",

                  marginBottom: "3%",
                  width: "100%",
                  background:
                    video.video_id === state.video_id ? "#C0C0C0" : "",
                  border:
                    video.video_id === state.video_id
                      ? "2px solid #B3272C"
                      : "",
                }}
              >
                <CCardBody style={{ margin: "0" }}>
                  <CRow>
                    <CCol sm="1">
                      <CCardText
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          textAlign: "center",
                          verticalAlign: "center",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
                        <span style={{ color: "black" }}>
                          {" "}
                          {video.video_id === state.video_id ? (
                            <CIcon name="cilMediaPlay" />
                          ) : (
                            index + 1
                          )}{" "}
                        </span>
                      </CCardText>
                    </CCol>
                    <CCol sm="11">
                      <CImg
                        style={{
                          width: "90px",
                          height: "60px",
                          float: "left",
                          marginRight: "3%",
                          borderBottom: "1px solid black",
                          borderRadius: "10px",
                        }}
                        src={API_URL + "images/getImage/" + video.video_id}
                      />
                      <CCardText>
                        <h6 style={{ color: "black" }}>
                          {video.title.substring(0, 100) + "..."}
                        </h6>
                        <span style={{ color: "black" }}> {video.channel}</span>
                      </CCardText>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </div>
      ) : (
        <div
          // className="c-app c-default-layout"
          style={{
            // height: "100%"
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
