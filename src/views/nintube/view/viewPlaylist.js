//REACT
import React, { useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
import { useParams } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CRow,
  CCol,
  CButton,
  CBreadcrumb,
  CInput,
  CFormGroup,
  CLabel,
  CInputRadio,
  CSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { confirmAlert } from "react-confirm-alert"; // Import
//Componets
import Player from "../components/playerPlaylist";
import Comments from "../components/Comments";
import Recommended from "../components/Recommended";
import SavePlaylist from "../components/savePlaylist";
//Style
//API
import Dropzone from "react-dropzone";
import { alert } from "../../../util/alertApi";
import {
  getVideo,
  Inscribe,
  Report,
  watchVideo,
  API_URL,
  newLiked,
} from "../../../util/Api";
//Style
import "../components/componentStyle.css";

const ViewPlaylist = ({ user, history }) => {
  let { id, playlistid } = useParams();
  const [state, setState] = useState({
    fetched: false,
    subscribe: false,
    color_like: "",
    color_dislike: "",
    video: "",
    op_report: "",
    report: "",
    playlistComp: "",
    tags: [],
    status: "",
  });

  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
  };

  const shared = (item) => {
    history.push("/search/" + "TAG:" + item);
  };

  const Change = (cond) => {
    if (user) {
      var data = {
        token: user.token,
        target_id: state.video.owner_id,
      };

      Inscribe(data)
        .then(function (data) {
          let video = state.video;
          if (cond) {
            video.all_subs += 1;
          } else {
            video.all_subs -= 1;
          }
          video.is_subscribed = cond;
          setState({ ...state, video });
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

  const callSave = () => {
    if (user) {
      setState({
        ...state,
        playlistComp: <SavePlaylist video_id={id} kill={closeSavePlaylist} />,
      });
    } else {
      alert("Ops...", "Tens que estar logado para salvar o video");
    }
  };

  const Liked = (liked) => {
    if (user) {
      if (!state.video.owner) {
        switch (liked) {
          case "like":
            var video = state.video;
            if (video.liked === 1) {
              video.likes -= 1;
              video.liked = 0;
              setState({
                ...state,
                color_like: "white",
                video,
              });
            } else if (video.liked === -1) {
              video.likes += 1;
              video.dislikes -= 1;
              video.liked = 1;
              setState({
                ...state,
                color_like: "green",
                color_dislike: "white",
                video,
              });
            } else {
              video.likes += 1;
              video.liked = 1;
              setState({
                ...state,
                color_like: "green",
                video,
              });
            }
            break;
          case "dislike":
            var video = state.video;
            if (video.liked === -1) {
              video.dislikes -= 1;
              video.liked = 0;
              setState({
                ...state,
                color_dislike: "white",
                video,
              });
            } else if (video.liked === 1) {
              video.dislikes += 1;
              video.likes -= 1;
              video.liked = -1;
              setState({
                ...state,
                color_dislike: "red",
                color_like: "white",
                video,
              });
            } else {
              video.dislikes += 1;
              video.liked = -1;
              setState({
                ...state,
                color_dislike: "red",
                video,
              });
            }
            break;
        }
        var video = state.video;

        var data = {
          token: user.token,
          video_id: id,
          liked: video.liked,
        };

        newLiked(data).then(function (data) {});
      }
    } else {
      alert("Ops...", "Tens que estar logado para curtir um video");
    }

    // });
  };

  const closeSavePlaylist = () => {
    setState({ ...state, playlistComp: "" });
  };

  const reportVideo = () => {
    if (!state.video.reported) {
      if (user) {
        if (!state.video.owner) {
          confirmAlert({
            customUI: ({ onClose }) => {
              var text,
                option = "";
              return (
                <div className="custom-ui">
                  <h1>Report</h1>
                  <CFormGroup row>
                    <CCol md="9">
                      <p>
                        Selecione o motivo que melhor encaixe no report abaixo:
                      </p>
                      <CFormGroup variant="checkbox">
                        <CInputRadio
                          className="form-check-input"
                          id="radio1"
                          name="radios"
                          value={"Violencia Explicita"}
                          onClick={(e) => {
                            option = e.target.value;
                          }}
                        />
                        <CLabel
                          variant="checkbox"
                          style={{ color: "black" }}
                          htmlFor="radio1"
                        >
                          Violencia Explicita
                        </CLabel>
                      </CFormGroup>
                      <CFormGroup variant="checkbox">
                        <CInputRadio
                          className="form-check-input"
                          id="radio2"
                          name="radios"
                          value="Conteudo Sexual"
                          onClick={(e) => {
                            option = e.target.value;
                          }}
                        />
                        <CLabel
                          variant="checkbox"
                          style={{ color: "black" }}
                          htmlFor="radio2"
                        >
                          Conteudo Sexual
                        </CLabel>
                      </CFormGroup>
                      <CFormGroup variant="checkbox">
                        <CInputRadio
                          className="form-check-input"
                          id="radio3"
                          name="radios"
                          value="outros"
                          onClick={(e) => {
                            option = e.target.value;
                          }}
                        />
                        <CLabel
                          variant="checkbox"
                          style={{ color: "black" }}
                          htmlFor="radio3"
                        >
                          Outros
                        </CLabel>
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>
                  <p>Detalhe o motivo do report abaixo:</p>

                  <CInput
                    type="text"
                    onChange={(e) => {
                      text = e.target.value;
                      // setReport({ ...re, text: e.target.value });
                    }}
                  ></CInput>
                  <button class="myBut" onClick={onClose}>
                    Sair
                  </button>
                  <button
                    class="myBut"
                    onClick={() => sendReport(text, option)}
                  >
                    Enviar
                  </button>
                </div>
              );
            },
          });
        }
      } else {
        alert("Reporte", "Necessario login para o reportar");
      }
    } else {
      alert("Reporte", "Já tens um reporte nesse video");
    }
  };

  const sendReport = (text, option) => {
    var data = {
      video_id: id,
      token: user.token,
      report_text: text,
      report_option: option,
    };
    if (text !== "" && option !== "") {
      Report(data)
        .then(function (data) {
          alert("Reporte", "Seu reporte foi enviado com sucesso!");
          let videoRep = state.video;
          videoRep.reported = true;
          setState({ ...state, video: videoRep });
        })
        .catch((err) => {
          alert(
            "Reporte",
            "Ouve algum erro com o seu reporte tente novamente mais tarde!"
          );
        });
    }
  };

  useEffect(() => {
    if (!state.fetched) {
      if (id === null) {
        window.confirm("Error");
        history.push("/home/");
      }
      if (user) {
        var data = {
          video_id: id,
          token: user.token,
        };
      } else {
        var data = {
          video_id: id,
          token: "",
        };
      }

      watchVideo(data)
        .then(function (data) {
          setState({
            ...state,
            fetched: true,
            video: data.pageData,
            tags: data.tags,
            status: data.status,
            color_like: data.pageData.liked === 1 ? "green" : "white",
            color_dislike: data.pageData.liked === -1 ? "red" : "white",
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
    <>
      {state.status !== 1 && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      <div style={{ display: "flex", width: "100%" }}>
        {state.status === 1 && (
          <>
            <div style={{ marginRight: "auto", width: "100%" }}>
              <Player />
              <CBreadcrumb style={{ width: "90%", marginLeft: "1.7%" }}>
                <div
                  style={{ width: "90%", marginLeft: "1.5%", color: "white" }}
                >
                  {state.tags.map((item, index) => (
                    <a
                      style={{ color: "lightblue", cursor: "pointer" }}
                      onClick={() => shared(item.name)}
                    >
                      #{item.name}{" "}
                    </a>
                  ))}
                </div>
                <h5
                  style={{ width: "90%", marginLeft: "1.5%", color: "white" }}
                >
                  {state.video.title}
                </h5>
                <div
                  style={{
                    width: "100%",
                    marginLeft: "1.5%",
                    display: "flex",
                    height: "25px",
                  }}
                >
                  <div style={{ width: "50%", verticalAlign: "center" }}>
                    <span style={{ color: "white", verticalAlign: "center" }}>
                      {state.video.views} Visualizações
                    </span>
                  </div>
                  <div
                    style={{
                      marginLeft: "10%",
                      height: "100%",
                      // verticalAlign: "top",
                    }}
                  >
                    <CButton
                      style={{ color: state.color_like }}
                      onClick={() => Liked("like")}
                    >
                      <CIcon name="cilThumbUp" /> {state.video.likes}
                    </CButton>
                    <CButton
                      style={{ color: state.color_dislike }}
                      onClick={() => Liked("dislike")}
                    >
                      <CIcon name="cilThumbDown" /> {state.video.dislikes}
                    </CButton>
                    <CButton
                      style={{ color: "white" }}
                      onClick={() => callSave()}
                    >
                      <CIcon name="cil-playlist-add" /> Salvar
                    </CButton>
                    <CButton
                      style={{ color: "white" }}
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert(
                          "Compartilhar",
                          "Link copiado para área de transferência",
                          [{ label: "Fechar", onClick: "" }]
                        );
                      }}
                    >
                      <CIcon name="cil-share" /> Compartilhar
                    </CButton>

                    <CButton
                      style={{
                        color: "white",
                      }}
                      onClick={() => reportVideo()}
                    >
                      <CIcon name="cilFlagAlt" /> Reportar
                    </CButton>
                  </div>
                </div>
              </CBreadcrumb>
              <CBreadcrumb
                style={{ width: "95%", marginLeft: "1.7%", display: "flex" }}
              >
                <div style={{ width: "7%", height: "100%" }}>
                  <img
                    onClick={() => handleClick("channel", state.video.owner_id)}
                    src={API_URL + "images/getAvatar/" + state.video.owner_id}
                    style={{ borderRadius: "40%", cursor: "pointer" }}
                    width="44"
                    height="44"
                  />
                </div>
                <div style={{ width: "90%" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      color: "white",
                    }}
                  >
                    <div style={{ width: "90%" }}>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          handleClick("channel", state.video.owner_id)
                        }
                      >
                        {state.video.owner_nick}
                      </span>
                      <p>{state.video.all_subs} subscribers</p>
                    </div>
                    <div style={{ width: "1%" }}>
                      <>
                        {state.video.owner === false && (
                          <>
                            {state.video.is_subscribed === false && (
                              <CButton
                                id="inscribe"
                                class="inscribe"
                                onClick={() => Change(true)}
                              >
                                Inscrever-se
                              </CButton>
                            )}{" "}
                            {state.video.is_subscribed === true && (
                              <CButton
                                id="inscribe"
                                class="registered"
                                onClick={() => Change(false)}
                              >
                                Inscrito
                              </CButton>
                            )}
                          </>
                        )}
                      </>
                    </div>
                  </div>
                  <div style={{ color: "white" }}>
                    {state.video.description}
                  </div>
                </div>
              </CBreadcrumb>
              <Comments />
            </div>
            {/* </CCol>
        <CCol sm="4"> */}
            {/* <div style={{ marginLeft: "auto", width: "25%" }}>
              <Recommended />
            </div> */}
            {state.playlistComp}
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ViewPlaylist);
