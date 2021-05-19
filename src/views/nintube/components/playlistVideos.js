//REACT
import React, { useState, useEffect, useRef } from "react";
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
  CInput,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//API
import {
  listPlaylist,
  removeVideoFromPlaylist,
  deletPlaylist,
  editPlaylist,
  API_URL,
} from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
import { alert } from "../../../util/alertApi";
//Style
import "./componentStyle.css";

const playlist = { name: "Minha Playlist", privacy: true, is_owner: true };

const PlaylistVideos = ({ user }) => {
  let { id } = useParams();

  const [state, setState] = useState({
    fetched: false,
    playlist: "",
    status: false,
    videos: [],
    today: new Date(),
    change: false,
    playlist_edit: "",
    visible: false,
  });

  let history = useHistory();
  const handleClick = (target) => {
    var route = target.split("_");

    route.length === 2
      ? history.push("/" + route[0] + "/" + route[1])
      : history.push("/" + route[0] + "/" + route[1] + "/" + route[2]);
  };

  const changePossition = (old_index, new_index, element) => {
    let vet_playlist = [];
    if (state.element !== "") {
      for (let index = 0; index < state.videos.length; index++) {
        switch (index) {
          case old_index:
            old_index < new_index
              ? vet_playlist.push(state.videos[index + 1])
              : vet_playlist.push(state.videos[index - 1]);
            break;
          case new_index:
            old_index < new_index
              ? vet_playlist.push(state.videos[index - 1])
              : vet_playlist.push(state.videos[index + 1]);
            break;
          default:
            vet_playlist.push(state.videos[index]);
        }
      }
    }
    setState({ ...state, videos: vet_playlist, change: true });
  };

  const Edit = () => {
    var videos = [];
    state.videos.map((item, index) => {
      videos.push(item.video_id);
    });
    var data = {
      token: user.token,
      name: state.playlist.name,
      playlist_id: id,
      is_public: state.playlist.public,
      videos: videos,
    };
    setState({ ...state, change: false });
    editPlaylist(data)
      .then(function (data) {
        alert("Ação", "Sua Playlist foi editada com sucesso!");
      })
      .catch((err) => {
        alert(
          "Ação",
          "Ouve algume erro ao editar a playlist, por favor tentar novamente mais tarde!"
        );
      });
  };

  const Delete = (video_id, idx) => {
    var data = { token: user.token, playlist_id: id, video_id: video_id };
    let vet_playlist = [];
    for (let index = 0; index < state.videos.length; index++) {
      if (index !== idx) {
        vet_playlist.push(state.videos[index]);
      }
    }
    removeVideoFromPlaylist(data)
      .then(function (data) {
        setState({ ...state, videos: vet_playlist });
        alert("Ação", "Video foi deletado com sucesso!");
      })
      .catch((err) => {
        alert(
          "Ação",
          "Ouve algume erro ao deletar o video, por favor tentar novamente mais tarde!"
        );
      });
  };

  const buildPlaylist = () => {
    return state.videos.map((item, index) => {
      return (
        <CRow name={"view_" + id}>
          {state.playlist.is_owner && (
            <CCol sm="1" style={{ display: "flex", marginBottom: "1%" }}>
              <CCard
                style={{
                  marginBottom: "auto",
                  marginTop: "auto",
                  marginRight: "auto",
                  marginLeft: "auto",
                  padding: "3px",
                  display: "flex",
                }}
              >
                {index !== 0 && (
                  <CButton
                    title="Subir"
                    color="btn btn-ghost-dark"
                    onClick={(e) => changePossition(index, index - 1, item)}
                  >
                    {" "}
                    <CIcon name="cilCaretTop" />{" "}
                  </CButton>
                )}
                {index !== state.videos.length - 1 && (
                  <CButton
                    title="Descer"
                    color="btn btn-ghost-dark"
                    onClick={(e) => changePossition(index, index + 1, item)}
                  >
                    {" "}
                    <CIcon name="cilCaretBottom" />{" "}
                  </CButton>
                )}
              </CCard>
            </CCol>
          )}
          <CCol
            name={"viewPlaylist_" + id + "_" + item.video_id}
            onClick={(e) => handleClick(e.target.getAttribute("name"))}
            md="10"
            style={{ cursor: "pointer", width: "100%" }}
          >
            <CCard
              name={"viewPlaylist_" + id + "_" + item.video_id}
              id={"id_card_" + index}
              key={"key_card_" + index}
              style={{
                width: "100%",
                marginBottom: "1%",
                border: "2px solid #B3272C",
              }}
            >
              <CCardBody
                name={"viewPlaylist_" + id + "_" + item.video_id}
                style={{ width: "100%" }}
                row
              >
                <CImg
                  name={"viewPlaylist_" + id + "_" + item.video_id}
                  style={{
                    width: "125px",
                    height: "80px",
                    float: "left",
                    marginRight: "1%",
                    borderBottom: "1px solid black",
                    borderRadius: "10px",
                  }}
                  //
                  src={API_URL + "images/getImage/" + item.video_id}
                />
                <span name={"viewPlaylist_" + id + "_" + item.video_id} row>
                  <h5
                    name={"viewPlaylist_" + id + "_" + item.video_id}
                    style={{}}
                  >
                    {item.title}
                  </h5>
                  <span
                    name={"channel_" + item.owner_id}
                    className="ChannelPlaylist"
                    style={{ cursor: "pointer" }}
                    // onClick={() => handleClick("channel", item.owner_id)}
                  >
                    {item.owner_nick}
                  </span>{" "}
                </span>{" "}
              </CCardBody>
            </CCard>
          </CCol>
          {state.playlist.is_owner && (
            <CCol md="1" style={{ display: "flex", marginBottom: "1%" }}>
              <CCard
                style={{
                  marginBottom: "auto",
                  marginTop: "auto",
                  marginRight: "auto",
                  marginLeft: "auto",
                  padding: "3px",
                }}
              >
                <CButton
                  color="btn btn-ghost-danger"
                  title="Deletar"
                  onClick={() => Delete(item.video_id, index)}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </CCard>
            </CCol>
          )}
        </CRow>
      );
    });
  };
  useEffect(() => {
    if (!state.fetched) {
      if (user !== null && user !== "") {
        var data = { token: user.token, playlist_id: id };
        listPlaylist(data)
          .then(function (data) {
            setState({
              ...state,
              fetched: true,
              playlist: data.data,
              status: data.data.status,
              playlist_edit: data.data.name,
              videos: data.videos,
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
      // setState({
      //   ...state,
      //   fetched: true,
      //   playlist: playlist,
      //   playlist_edit: playlist.name,
      //   videos: videos,
      // });
    }
  }, []);

  return (
    <div
      className="c-app c-default-layout"
      style={{ display: "flex", height: "100%" }}
    >
      {!state.status && (
        <div className="div-reload">
          <CIcon className="icone" name="cilReload" size="3xl" />
        </div>
      )}
      <div
        style={{
          position: "fixed",
          marginRight: "auto",
          height: "80%",
          width: "620px",
        }}
      >
        <CCard
          class="bg-black"
          style={{
            height: "100%",
          }}
        >
          {state.status && (
            <CCardBody
              style={{ border: "2px solid #B3272C", borderRadius: "20px" }}
            >
              {state.videos.length === 0 ? (
                <div>
                  <CImg
                    style={{
                      width: "100%",
                      height: "350px",
                      marginRight: "1%",
                      borderBottom: "1px solid black",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    src={"https://i.ytimg.com/img/no_thumbnail.jpg"}
                  />
                </div>
              ) : (
                <div>
                  <CImg
                    style={{
                      width: "100%",
                      height: "350px",
                      marginRight: "1%",
                      borderBottom: "1px solid black",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                    src={
                      API_URL + "images/getImage/" + state.videos[0].video_id
                    }
                    onClick={() =>
                      history.push(
                        "/viewPlaylist/" + id + "/" + state.videos[0].video_id
                      )
                    }
                  />
                </div>
              )}

              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {" "}
                <CCardText style={{ width: "100%", height: "100%" }}>
                  {" "}
                  <h3
                    className="style-scope ytd-inline-form-renderer"
                    style={{
                      display: "flex",
                      marginTop: "1%",
                      marginBottom: "2%",
                    }}
                  >
                    {state.visible ? (
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CInput
                          style={{ width: "100%" }}
                          value={state.playlist_edit}
                          onChange={(e) =>
                            setState({
                              ...state,
                              playlist_edit: e.target.value,
                            })
                          }
                        />
                        <div style={{ marginLeft: "auto" }}>
                          <CButton
                            style={{ color: "#0693E3" }}
                            onClick={() => {
                              var playlist = { ...state.playlist };
                              playlist.name = state.playlist_edit;
                              setState({
                                ...state,
                                visible: !state.visible,
                                playlist,
                                change: true,
                              });
                            }}
                          >
                            Salvar
                          </CButton>
                          <CButton
                            style={{ color: "white" }}
                            onClick={() =>
                              setState({ ...state, visible: !state.visible })
                            }
                          >
                            Cancelar
                          </CButton>
                        </div>
                      </div>
                    ) : (
                      <div style={{ width: "100%", display: "flex" }}>
                        <span
                          style={{
                            marginBottom: "auto",
                            marginTop: "auto",
                          }}
                        >
                          {" "}
                          {state.playlist.name}
                        </span>
                        {state.playlist.is_owner && !state.playlist.fixed && (
                          <CButton
                            color="btn btn-ghost-light"
                            title="Editar"
                            style={{
                              marginBottom: "auto",
                              marginLeft: "auto",
                              outline: "none",
                            }}
                            onClick={() =>
                              setState({ ...state, visible: !state.visible })
                            }
                          >
                            {" "}
                            <CIcon name="cilPen" size="lg" />{" "}
                          </CButton>
                        )}{" "}
                      </div>
                    )}
                  </h3>
                  <p style={{ display: "flex" }}>
                    {/* {!state.playlist.fixed && (
                      <CSelect
                        style={{ width: "20%", marginRight: "1%" }}
                        onChange={(e) => {
                          let playlist = { ...state.playlist };
                          playlist.privacy = e.target.value;
                          setState({
                            ...state,
                            playlist,
                            change: true,
                          });
                        }}
                      >
                        <option value={true} selected={!state.playlist.public}>
                          Privado
                        </option>
                        <option value={false} selected={state.playlist.public}>
                          Público
                        </option>
                      </CSelect>
                    )} */}
                    <span style={{ marginTop: "auto", marginBottom: "auto" }}>
                      {state.playlist.public ? "Público" : "Privado"}
                      {state.playlist.public} • {state.videos.length} vídeos •{" "}
                      {`Atualizado ${diffDate(
                        state.today,
                        state.playlist.created_at
                      )}`}
                    </span>
                    {state.playlist.is_owner && !state.playlist.fixed && (
                      <CButton
                        style={{
                          marginLeft: "1%",
                          marginTop: "auto",
                          marginBottom: "auto",
                        }}
                        onClick={() => {
                          let playlist = { ...state.playlist };
                          playlist.public = !state.playlist.public;
                          setState({
                            ...state,
                            playlist,
                            change: true,
                          });
                        }}
                        color="btn btn-ghost-light"
                        title="Trocar Privacidade"
                      >
                        {state.playlist.public ? (
                          <CIcon
                            name="cilLockUnlocked"
                            // size="lg"
                          />
                        ) : (
                          <CIcon
                            name="cilLockLocked"
                            // size="lg"
                          />
                        )}
                      </CButton>
                    )}
                    <div
                      style={{
                        marginLeft: "1%",
                        marginTop: "auto",
                        marginBottom: "auto",
                      }}
                    >
                      {state.playlist.fixed && (
                        <CIcon
                          name="cilLockLocked"
                          // size="lg"
                        />
                      )}
                    </div>
                    {state.change && state.playlist.is_owner && (
                      <div style={{ marginLeft: "auto" }}>
                        <CButton color="info" onClick={() => Edit()}>
                          Salvar Alterações
                        </CButton>
                      </div>
                    )}
                  </p>
                  {/* <span style={{ cursor: "pointer" }}> Teste</span>{" "} */}
                </CCardText>{" "}
                {state.playlist.is_owner && !state.playlist.fixed && (
                  <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                      <CButton
                        color="danger"
                        onClick={() =>
                          alert(
                            "Deletar",
                            "Tens certeza que queres deletar a playlist " +
                              state.playlist.name +
                              " ?",
                            [
                              {
                                label: "Cancelar",
                              },
                              {
                                label: "Deletar",
                                onClick: () => {
                                  var data = {
                                    token: user.token,
                                    playlist_id: id,
                                  };
                                  deletPlaylist(data)
                                    .then(function (data) {
                                      alert(
                                        "Ação",
                                        "Sua Playlist foi deletada com sucesso!",
                                        [
                                          {
                                            label: "Confirmar",
                                            onClick: () => {
                                              history.push("/home");
                                            },
                                          },
                                        ]
                                      );
                                    })
                                    .catch((err) => {
                                      alert(
                                        "Ação",
                                        "Ouve algume erro ao Deletar a playlist, por favor tentar novamente mais tarde!"
                                      );
                                    });
                                },
                              },
                            ]
                          )
                        }
                      >
                        Deletar Playlist
                      </CButton>
                    </div>
                  </div>
                )}
              </div>
            </CCardBody>
          )}
        </CCard>
      </div>
      <div style={{ marginLeft: "680px", height: "90%", width: "100%" }}>
        {buildPlaylist()}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(PlaylistVideos);
