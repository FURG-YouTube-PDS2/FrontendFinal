//REACT
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
import ShowVideos from "../components/showVideos";
import AllPlaylists from "../components/allPlaylists";
import ChannelVideos from "./channelVideos";
import ChannelSearch from "./ChannelSearch";
//Style
import "../styles/nintube.css";
import "../components/componentStyle.css";
//API
import { Inscribe, channelData, API_URL } from "../../../util/Api";

const Channel = ({ user }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    fetched: false,
    content: 1,
    subscribe: false,
    search: "",
    channel: { nick: "", subs: 0, avatar: "", is_sub: false, is_owner: false },
  });
  useEffect(() => {
    if (!state.fetched) {
      if (user !== null && user !== "") {
        var data = {
          user_id: id !== "0" ? id : "",
          token: user.token,
        };
      } else {
        var data = {
          user_id: id,
          token: "",
        };
      }
      // changeContent("video");
      channelData(data)
        .then(function (data) {
          var channel = { ...state.channel };
          channel.nick = data.channel_nick;
          channel.avatar = data.channel_avatar;
          channel.subs = data.all_subs;
          channel.is_sub = data.is_subs;
          channel.is_owner = data.is_owner;
          setState({ ...state, fetched: true, channel, content: 2 });
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

  const Change = (cond) => {
    if (user) {
      var data = { token: user.token, target_id: id };
      Inscribe(data)
        .then(function (data) {
          var channel = { ...state.channel };

          if (cond) {
            channel.subs += 1;
          } else {
            channel.subs -= 1;
          }
          channel.is_sub = cond;
          // channel.subs = channel.subs + 1;
          setState({ ...state, channel });
        })
        .catch((err) => {
          setState({
            ...state,
            error: "Algum problema aconteceu, tente novamente mais tarde!",
            message: "",
          });
        });
    } else {
      alert("Login", "Você não está logado!");
    }
  };
  const changeContent = (component) => {
    let contents = {
      init: 1,
      video: 2,
      playlist: 3,
      about: 4,
      search: 5,
    };
    setState({ ...state, content: contents[component] });
    // eslint-disable-next-line default-case
    // switch (component) {
    //   case "init":
    //     setState({ ...state, content: 1 });
    //     break;
    //   case "video":
    //     setState({ ...state, content: 2 });
    //     break;
    //   case "playlist":
    //     setState({ ...state, content: 3 });
    //     break;
    //   case "about":
    //     setState({ ...state, content: 4 });
    //     break;
    // }
  };

  const handleKeys = (e) => {
    if (e.keyCode === 13) {
      changeContent("search");
    }
  };

  return (
    <div id="test">
      {!state.fetched && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      <header>
        <CCard style={{ height: "100%" }}>
          <CCardBody style={{ width: "100%" }}>
            <div>
              <CRow>
                <CCol sm="3">
                  <div
                    style={{
                      display: "flex",
                      // justifyContent: "space-between",
                      // margin: "0",
                      // verticalAlign: "middle",
                      // flexDirection: "row",
                      // flexWrap: "nowrap",
                      marginBottom: "1%",
                    }}
                  >
                    <div
                      style={{
                        width: "30%",
                        marginRight: "1%",
                      }}
                    >
                      <CImg
                        src={
                          id === "0"
                            ? API_URL + "images/getYourAvatar/" + user.token
                            : API_URL + "images/getAvatar/" + id
                        }
                        // src={state.channel.avatar}
                        className="c-avatar-img"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          // height: "100%",
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <span>
                          <span
                            className="h2"
                            style={
                              {
                                // margin: "auto",
                              }
                            }
                          >
                            {state.channel.nick}
                          </span>{" "}
                          <br />
                          {state.channel.subs} inscrito(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </CCol>
                <CCol sm="3" style={{ display: "flex" }}>
                  <div
                    style={{ width: "100%", height: "50%", marginTop: "auto" }}
                  >
                    <CButton
                      onClick={() => {
                        changeContent("video");
                      }}
                      className="channel_button"
                    >
                      Vídeos
                    </CButton>
                  </div>
                </CCol>
                <CCol sm="3" style={{ display: "flex" }}>
                  <div
                    style={{ width: "100%", height: "50%", marginTop: "auto" }}
                  >
                    <CButton
                      onClick={() => {
                        changeContent("playlist");
                      }}
                      className="channel_button"
                    >
                      Playlists
                    </CButton>
                  </div>
                </CCol>
                <CCol
                  sm="3"
                  style={{
                    display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                  }}
                >
                  {state.channel.is_sub === false &&
                    !state.channel.is_owner &&
                    state.fetched && (
                      <div
                        style={{
                          marginLeft: "auto",
                          marginTop: "auto",
                        }}
                      >
                        <CButton
                          id="inscribe"
                          class="inscribe"
                          onClick={() => Change(true)}
                        >
                          Inscrever-se
                        </CButton>
                      </div>
                    )}
                  {state.channel.is_sub === true &&
                    !state.channel.is_owner &&
                    state.fetched && (
                      <div
                        style={{
                          marginLeft: "auto",
                          marginTop: "auto",
                        }}
                      >
                        <CButton
                          id="inscribe"
                          class="registered"
                          onClick={() => Change(false)}
                        >
                          Inscrito
                        </CButton>
                      </div>
                    )}
                </CCol>
              </CRow>
            </div>
          </CCardBody>
        </CCard>
      </header>
      {state.content != 5 && (
        <div>
          <center>
            <CInputGroup
              style={{
                border: "1px solid red",
                borderRadius: "5px",
                width: "50%",
              }}
            >
              <CInput
                placeholder="Pesquisar"
                onKeyUp={handleKeys}
                onChange={(e) => {
                  setState({ ...state, search: e.target.value });
                }}
              />
              <CInputGroupAppend>
                <CInputGroupText>
                  <CIcon
                    name="cil-magnifying-glass"
                    onClick={() => {
                      changeContent("search");
                    }}
                  />
                </CInputGroupText>
              </CInputGroupAppend>
            </CInputGroup>
          </center>
          <br />
        </div>
      )}
      {/* {state.content === 1 ? <h1>Inicio</h1> : null} */}
      <div hidden={state.content !== 2}>
        {" "}
        <ChannelVideos />{" "}
      </div>
      <div hidden={state.content !== 3}>
        {" "}
        <AllPlaylists />
      </div>
      {/* {state.content === 2 ? <ChannelVideos /> : null}
      {state.content === 3 ? <AllPlaylists /> : null} */}
      {/* {state.content === 4 ? <h1>Sobre</h1> : null} */}
      {state.content === 5 ? (
        <ChannelSearch search={state.search} channel_id={id} />
      ) : null}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Channel);
