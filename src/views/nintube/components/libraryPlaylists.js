//REACT
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CLink,
  CButton,
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardSubtitle,
  CCardText,
  CCardHeader,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Compoment
import NoVideo from "./noVideo";
//API
import { Library, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
//Style
import "./componentStyle.css";

const LibraryPlaylists = ({ user }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    fetched: false,
    playlist: [],
    watch_late: [],
    liked: [],
    id_watch_late: "",
    id_videos_lik: "",
    today: new Date(),
  });
  let history = useHistory();
  const handleClick = (route, id, playlist = 0, size) => {
    if (playlist !== 0) {
      if (size !== 0) {
        history.push("/" + route + "/" + playlist + "/" + id);
      }
    } else {
      history.push("/" + route + "/" + id);
    }
  };
  useEffect(() => {
    if (!state.fetched) {
      var data = {
        id_target: id !== "0" && id !== undefined ? id : "",
        token: user.token,
      };
      Library(data)
        .then(function (data) {
          setState({
            ...state,
            fetched: true,
            playlist: data.playlist,
            watch_late: data.videos_lat,
            liked: data.videos_lik,
            id_watch_late: data.id_videos_later,
            id_videos_lik: data.id_videos_lik,
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
          ]);
        });
    }
  }, []);
  return (
    <div>
      {!state.fetched ? (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      ) : state.playlist.lenght !== 0 ? (
        <div>
          <CContainer fluid>
            <div style={{ display: "flex" }}>
              <h3 style={{ color: "white" }}>{state.id_watch_late.name}</h3>{" "}
              <div style={{ marginLeft: "auto" }}>
                <CButton
                  style={{ color: "white" }}
                  onClick={() =>
                    history.push("playlist/" + state.id_watch_late.id)
                  }
                >
                  Ver tudo
                </CButton>
              </div>
            </div>
            <CRow>
              <>
                {state.watch_late.length === 0 && (
                  <CRow className="justify-content-center">
                    <CCol>
                      <h1 style={{ color: "white" }}>:( Sem vídeos</h1>
                    </CCol>
                  </CRow>
                )}
              </>
              {state.watch_late.map((item, index) => (
                <CCol style={{ width: "5%" }} sm="2">
                  <CCard style={{ border: "2px solid #B3272C" }}>
                    <CImg
                      onClick={() => handleClick("view", item.video_id)}
                      style={{
                        width: "100%",
                        height: "150px",
                        cursor: "pointer",
                        borderBottom: "1px solid black",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.video_id}
                    />
                    <div>
                      <CCardBody style={{ fontSize: "80%" }}>
                        <h3
                          onClick={() => handleClick("view", item.video_id)}
                          style={{ fontSize: "120%", cursor: "pointer" }}
                        >
                          {item.title.length <= 103
                            ? item.title
                            : item.title.substring(0, 100) + "..."}
                        </h3>{" "}
                        <CCardText
                          style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("channel", item.id)}
                          >
                            {item.owner_nick}
                          </span>
                          <CCardText
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("view", item.video_id)}
                          >{`${item.views} • ${diffDate(
                            state.today,
                            item.date
                          )}`}</CCardText>{" "}
                        </CCardText>
                      </CCardBody>
                    </div>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CContainer>
          <CContainer fluid>
            <div style={{ display: "flex" }}>
              <h3 style={{ color: "white" }}>{state.id_videos_lik.name}</h3>{" "}
              <div style={{ marginLeft: "auto" }}>
                <CButton
                  style={{ color: "white" }}
                  onClick={() =>
                    history.push("playlist/" + state.id_videos_lik.id)
                  }
                >
                  Ver tudo
                </CButton>
              </div>
            </div>
            <CRow>
              <>
                {state.liked.length === 0 && (
                  <CRow className="justify-content-center">
                    <CCol>
                      <h1 style={{ color: "white" }}>:( Sem vídeos</h1>
                    </CCol>
                  </CRow>
                )}
              </>
              {state.liked.map((item, index) => (
                <CCol style={{ width: "5%" }} sm="2">
                  <CCard style={{ border: "2px solid #B3272C" }}>
                    <CImg
                      onClick={() => handleClick("view", item.video_id)}
                      style={{
                        width: "100%",
                        height: "150px",
                        cursor: "pointer",
                        borderBottom: "1px solid black",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.video_id}
                    />
                    <div>
                      <CCardBody style={{ fontSize: "80%" }}>
                        <h3
                          onClick={() => handleClick("view", item.video_id)}
                          style={{ fontSize: "120%", cursor: "pointer" }}
                        >
                          {item.title.length <= 103
                            ? item.title
                            : item.title.substring(0, 100) + "..."}
                        </h3>{" "}
                        <CCardText
                          style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("channel", item.id)}
                          >
                            {item.owner_nick}
                          </span>
                          <CCardText
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("view", item.video_id)}
                          >{`${item.views} • ${diffDate(
                            state.today,
                            item.date
                          )}`}</CCardText>{" "}
                        </CCardText>
                      </CCardBody>
                    </div>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CContainer>
          <CContainer fluid>
            <h3 style={{ color: "white" }}>Playlists</h3>

            <CRow>
              <>
                {state.playlist.length === 0 && (
                  <CRow className="justify-content-center">
                    <CCol>
                      <h1 style={{ color: "white" }}>:( Sem vídeos</h1>
                    </CCol>
                  </CRow>
                )}
              </>
              {state.playlist.map((item, index) => (
                <CCol style={{ width: "5%" }} sm="2">
                  <CCard style={{ border: "2px solid #B3272C" }}>
                    <div
                      // className="style-scope ytd-grid-playlist-renderer"
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <div
                      // className="yt-simple-endpoint style-scope ytd-playlist-thumbnail"
                      >
                        {item.all_videos === 0 ? (
                          <div>
                            <CImg
                              style={{
                                width: "100%",
                                height: "150px",
                                cursor: "pointer",
                                borderBottom: "1px solid black",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }}
                              src={"https://i.ytimg.com/img/no_thumbnail.jpg"}
                            />
                          </div>
                        ) : (
                          <div>
                            <CImg
                              onClick={() =>
                                handleClick(
                                  "viewPlaylist",
                                  item.video_id,
                                  item.id,
                                  item.all_videos
                                )
                              }
                              style={{
                                width: "100%",
                                height: "150px",
                                cursor: "pointer",
                                borderBottom: "1px solid black",
                                borderBottomLeftRadius: "10px",
                                borderBottomRightRadius: "10px",
                              }}
                              src={API_URL + "images/getImage/" + item.video_id}
                            />
                          </div>
                        )}
                      </div>
                      <div
                        // className="style-scope ytd-playlist-thumbnail"
                        style={{
                          width: "50%",
                          height: "100%",
                          fontSize: "20px",
                          color: "white",
                          position: "absolute",
                          right: 0,
                          top: 0,
                          backgroundColor: "rgb(8 8 8 / 80%)",

                          display: "flex",
                        }}
                      >
                        <div
                          className="text-center"
                          style={{
                            // marginBottom: "auto",
                            // marginTop: "auto",
                            margin: "auto",
                            // flexDirection: "row",
                          }}
                        >
                          <span>{item.all_videos}</span>
                          <div>
                            <CIcon size="2xl" name="cilMenu"></CIcon>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <CCardBody style={{ fontSize: "80%" }}>
                        <h3
                          onClick={() =>
                            handleClick(
                              "viewPlaylist",
                              item.video_id,
                              item.id,
                              item.all_videos
                            )
                          }
                          style={{ fontSize: "120%", cursor: "pointer" }}
                        >
                          {item.name}
                        </h3>{" "}
                        <div>
                          {`${diffDate(state.today, item.created_at)}`}
                          <br />
                          <span
                            onClick={() => handleClick("playlist", item.id)}
                            style={{
                              marginBottom: "-1%",
                              marginTop: "5%",
                              cursor: "pointer",
                              color: "black",
                              fontWeight: "bold",
                            }}
                          >
                            Ver Playlist Completa
                          </span>
                        </div>
                        {/* <CCardText
                      style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                    >
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("channel", item.id)}
                      >
                        {item.channel}
                      </span>
                      <CCardText
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("view", item.video_id)}
                      >{`${item.views} • ${item.date}`}</CCardText>{" "}
                    </CCardText> */}
                      </CCardBody>
                    </div>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CContainer>
        </div>
      ) : (
        <NoVideo />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(LibraryPlaylists));
