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
//API
import { getPlaylists, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
//Style
import "../components/componentStyle.css";
import NoVideo from "../components/noVideo";

const AllPlaylists = ({ user }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    fetched: false,
    videos: [],
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
      if (user !== null && user !== "") {
        var data = {
          id_target: id !== "0" && id !== undefined ? id : "",
          token: user.token,
        };
      } else {
        var data = {
          id_target: id !== "0" && id !== undefined ? id : "",
          token: "",
        };
      }

      getPlaylists(data)
        .then(function (data) {
          setState({ ...state, fetched: true, videos: data });
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
      {!state.fetched && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      <CContainer fluid>
        <CRow>
          {state.videos.length === 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
              <NoVideo />
            </div>
          ) : (
            <>
              {state.videos.map((item, index) => (
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
                          src={
                            item.all_videos === 0
                              ? "https://i.ytimg.com/img/no_thumbnail.jpg"
                              : API_URL + "images/getImage/" + item.video_id
                          }
                        />
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
                            onClick={() =>
                              handleClick("playlist", item.id, item.all_videos)
                            }
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
                        onClick={() => handleClick("view", item.id)}
                      >{`${item.views} • ${item.date}`}</CCardText>{" "}
                    </CCardText> */}
                      </CCardBody>
                    </div>
                  </CCard>
                </CCol>
              ))}
            </>
          )}
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(AllPlaylists));
