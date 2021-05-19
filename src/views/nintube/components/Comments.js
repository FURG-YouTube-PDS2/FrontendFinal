import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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
  CWidgetIcon,
  CCardSubtitle,
  CCardText,
  CInput,
  CCardHeader,
  CImg,
  CBreadcrumb,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//Style
//API
// import { Report } from "../../../util/Api";
import { alert } from "../../../util/alertApi";
import {
  API_URL,
  getImg,
  sendComment,
  getComment,
  commentLiked,
  deletComment,
  editComment,
} from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
//Style
import "./componentStyle.css";

const Comments = ({ user }) => {
  const [state, setState] = useState({
    fetched: false,
    color_like: "white",
    color_dislike: "white",
    avatar: "",
    newComment: "",
    AnswersOne: "",
    AnswersTwo: "",
    idAns: "",
    idAnsTwo: "",
    dispAns: [],
    fiComment: [],
    secComment: [],
    showSec: [],
  });
  const [display, setDisplay] = useState({
    showComment: false,
    showAns: false,
    showAnsTwo: false,
    editing: false,
    editText: "",
    idEdit: "",
    oldComment: "",
  });

  let history = useHistory();
  let { id } = useParams();
  const video_id = id;

  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
  };

  const editingComment = (text, id) => {
    setDisplay({
      ...display,
      editing: true,
      oldComment: text,
      idEdit: id,
    });
  };

  const sendEdit = (text, id, nvl) => {
    exitEdit();
    var data = { text, comment_id: id };
    if (nvl == 0) {
      editComment(data).then(function (data) {
        let comment = state.fiComment;
        for (let i = 0; i < comment.length; i++) {
          if (data.comment_id === comment[i].id) {
            comment[i].comment = data.text;
            comment[i].edited = data.edited;
            comment[i].date = diffDate(new Date(), data.created_at);
            setState({
              ...state,
              fiComment: comment,
            });
          }
        }
      });
    } else {
      editComment(data).then(function (data) {
        let comment = state.dispAns;
        for (let w = 0; w < comment.length; w++) {
          for (let i = 0; i < comment[w].info.length; i++) {
            if (data.comment_id === comment[w].info[i][0].id) {
              comment[w].info[i][0].comment = data.text;
              comment[w].info[i][0].edited = data.edited;
              comment[w].info[i][0].date = diffDate(
                new Date(),
                data.created_at
              );
              setState({
                ...state,
                dispAns: comment,
              });
            }
          }
        }
      });
    }
  };

  const exitEdit = () => {
    setDisplay({
      ...display,
      editing: false,
      oldComment: "",
      idEdit: "",
    });
  };

  const comment = () => {
    if (user) {
      if (!display.showComment) {
        setState({
          ...state,
          newComment: "",
        });
        setDisplay({
          ...display,
          showComment: true,
        });
      }
    } else {
      alert("Ops...", "Você não está logado!");
    }
  };

  const sendCom = (text, nvl, reply_id, aux) => {
    if (nvl === 0) {
      var data = {
        token: user.token,
        text,
        video_id: id,
        reply_id: "",
      };
      setDisplay({
        ...display,
        showComment: false,
      });
      sendComment(data).then(function (data) {
        if (data !== "") {
          let comment = state.fiComment;
          let dis = state.dispAns;
          var comm = [
            {
              id: data.id.id,
              user_id: user.token,
              nickname: data.username,
              comment: data.text,
              date: diffDate(new Date(), data.created_at),
              src: API_URL + "images/getYourAvatar/" + user.token,
              reply_id: data.reply_id,
              likes: 0,
              liked: 0,
              color: "white",
              edited: false,
              is_owner: true,
            },
          ];
          comment = comm.concat(comment);
          var aux = [
            {
              id: data.id.id,
              dis: false,
              info: Array(0),
            },
          ];
          dis = aux.concat(dis);
          setState({
            ...state,
            fiComment: comment,
            dispAns: dis,
            newComment: "",
          });
        }
      });
    } else if (nvl === 1) {
      var data = {
        token: user.token,
        text,
        video_id: id,
        reply_id,
      };
      setDisplay({
        ...display,
        showAns: false,
      });
      sendComment(data).then(function (data) {
        if (data !== "") {
          let comment = state.dispAns;
          for (let i = 0; i < comment.length; i++) {
            if (comment[i].id === data.reply_id) {
              var aux = new Array();
              aux.push({
                id: data.id.id,
                user_id: user.token,
                nickname: data.username,
                comment: data.text,
                date: diffDate(new Date(), data.created_at),
                src: API_URL + "images/getYourAvatar/" + user.token,
                reply_id: data.reply_id,
                likes: 0,
                liked: 0,
                color: "white",
                edited: false,
                is_owner: true,
              });
              comment[i].info.push(aux);
            }
          }
          setState({
            ...state,
            dispAns: comment,
            AnswersOne: "",
            idAns: "",
          });
        }
      });
    } else {
      var data = {
        token: user.token,
        text: "@" + aux + " " + text,
        video_id: id,
        reply_id,
      };
      setDisplay({
        ...display,
        showAnsTwo: false,
      });
      sendComment(data).then(function (data) {
        if (data !== "") {
          let comment = state.dispAns;
          for (let i = 0; i < comment.length; i++) {
            if (comment[i].id === data.reply_id) {
              var aux = new Array();
              aux.push({
                id: data.id.id,
                nickname: data.username,
                comment: data.text,
                date: diffDate(new Date(), data.created_at),
                src: API_URL + "images/getYourAvatar/" + user.token,
                reply_id: data.reply_id,
                likes: 0,
                liked: 0,
                color: "white",
                edited: false,
                is_owner: true,
              });
              comment[i].info.push(aux);
            }
          }
          setState({
            ...state,
            dispAns: comment,
            newComment: "",
            idAnsTwo: "",
          });
        }
      });
    }
  };

  const exitComment = () => {
    setState({
      ...state,
      newComment: "",
    });
    setDisplay({
      ...display,
      showComment: false,
    });
  };

  const exitAns = (nvl) => {
    if (nvl === 1) {
      setState({
        ...state,
        AnswersOne: "",
        idAns: "",
      });
      setDisplay({
        ...display,
        showAns: false,
      });
    } else {
      setState({
        ...state,
        newComment: "",
        idAnsTwo: "",
      });
      setDisplay({
        ...display,
        showAnsTwo: false,
      });
    }
  };

  const showAns = (ind, id) => {
    let dispAns = state.dispAns;
    dispAns[ind].dis = !dispAns[ind].dis;
    setState({ ...state, dispAns });
  };

  const answers = (nvl, id) => {
    if (user) {
      if (nvl === 1) {
        setState({
          ...state,
          AnswersOne: "",
          idAns: id,
        });
        setDisplay({
          ...display,
          showAns: true,
        });
      } else {
        setState({
          ...state,
          newComment: "",
          idAnsTwo: id,
        });
        setDisplay({
          ...display,
          showAnsTwo: true,
        });
      }
    } else {
      alert("Ops...", "Você não está logado!");
    }
  };

  const Liked = (liked, nvl, id, id2, is_owner) => {
    if (user) {
      if (!is_owner) {
        if (nvl === 0) {
          let comment = state.fiComment;
          for (let i = 0; i < comment.length; i++) {
            if (id === comment[i].id) {
              switch (liked) {
                case "like":
                  if (comment[i].liked === 1) {
                    comment[i].likes -= 1;
                    comment[i].liked = 0;
                    comment[i].color = "white";
                    setState({
                      ...state,
                      fiComment: comment,
                    });
                  } else {
                    comment[i].likes += 1;
                    comment[i].liked = 1;
                    comment[i].color = "green";
                    setState({
                      ...state,
                      fiComment: comment,
                    });
                  }
                  break;
              }
              var data = {
                token: user.token,
                comment_id: id,
                liked: comment[i].liked,
              };
            }
          }
        } else {
          let comment = state.dispAns;
          for (let i = 0; i < comment.length; i++) {
            if (id2 === comment[i].id) {
              for (let w = 0; w < comment[i].info.length; w++) {
                if (id === comment[i].info[w][0].id) {
                  switch (liked) {
                    case "like":
                      if (comment[i].info[w][0].liked === 1) {
                        comment[i].info[w][0].likes -= 1;
                        comment[i].info[w][0].liked = 0;
                        comment[i].info[w][0].color = "white";
                        setState({
                          ...state,
                          dispAns: comment,
                        });
                      } else {
                        comment[i].info[w][0].likes += 1;
                        comment[i].info[w][0].liked = 1;
                        comment[i].info[w][0].color = "green";
                        setState({
                          ...state,
                          dispAns: comment,
                        });
                      }
                      break;
                  }
                  var data = {
                    token: user.token,
                    comment_id: id,
                    liked: comment[i].info[w][0].liked,
                  };
                }
              }
            }
          }
        }
        commentLiked(data).then(function (data) {});
      }
    }
  };

  const reportComment = () => {
    alert("Reporte", "Seu reporte foi enviado com sucesso!");
  };

  const deletCom = (comment_id, nvl, id) => {
    var data = {
      comment_id,
    };
    if (nvl === 0) {
      let comment = state.fiComment;
      let aux = [];
      for (let i = 0; i < comment.length; i++) {
        if (comment_id !== comment[i].id) {
          aux.push(comment[i]);
        }
      }
      setState({ ...state, fiComment: aux });
    } else {
      let sec_comment = state.dispAns;
      let aux = [];
      for (let i = 0; i < sec_comment.length; i++) {
        aux.push(sec_comment[i]);
        let auxInfo = [];

        if (id === sec_comment[i].id) {
          // aux[]
          for (let w = 0; w < sec_comment[i].info.length; w++) {
            if (comment_id !== sec_comment[i].info[w][0].id) {
              auxInfo.push(sec_comment[i].info[w]);
            }
          }
          aux[i].info = auxInfo;
        }
      }
      setState({ ...state, dispAns: aux });
    }
    deletComment(data).then(function (data) {});
  };

  useEffect(() => {
    if (!state.fetched) {
      if (!user) {
        var req = {
          name: "default",
        };
        var data = {
          numberSkip: 0,
          video_id: id,
          token: "",
        };
        var img;
        getImg(req).then(function (data) {
          state.avatar = data;
        });
      } else {
        state.avatar = API_URL + "images/getYourAvatar/" + user.token;
        var data = {
          numberSkip: 0,
          video_id: id,
          token: user.token,
        };
      }

      getComment(data)
        .then(function (data) {
          var listAux = Array();
          var today = new Date();
          var mtxAux = Array();
          var showAux = Array();

          for (let i = 0; i < data.length; i++) {
            if (data[i].reply_id === "") {
              listAux.push({
                id: data[i].id,
                user_id: data[i].user_id,
                nickname: data[i].nickname,
                comment: data[i].comment,
                date: diffDate(today, data[i].date),
                src: API_URL + "images/getAvatar/" + data[i].user_id,
                reply_id: data[i].reply_id,
                likes: data[i].likes,
                liked: data[i].liked,
                color: data[i].liked === 1 ? "green" : "white",
                edited: data[i].edited,
                is_owner: data[i].is_owner,
              });
              showAux.push({
                id: data[i].id,
                dis: false,
                info: Array,
              });
            } else {
              mtxAux.push({
                id: data[i].id,
                user_id: data[i].user_id,
                nickname: data[i].nickname,
                comment: data[i].comment,
                date: diffDate(today, data[i].date),
                src: API_URL + "images/getAvatar/" + data[i].user_id,
                reply_id: data[i].reply_id,
                likes: data[i].likes,
                liked: data[i].liked,
                color: data[i].liked === 1 ? "green" : "white",
                edited: data[i].edited,
                is_owner: data[i].is_owner,
              });
            }
          }

          for (let i = 0; i < showAux.length; i++) {
            var vexAux = new Array();
            for (let idx = 0; idx < mtxAux.length; idx++) {
              if (showAux[i].id === mtxAux[idx].reply_id) {
                var aux = new Array();
                aux.push({
                  id: mtxAux[idx].id,
                  user_id: mtxAux[idx].user_id,
                  nickname: mtxAux[idx].nickname,
                  comment: mtxAux[idx].comment,
                  date: mtxAux[idx].date,
                  src: mtxAux[idx].src,
                  reply_id: mtxAux[idx].reply_id,
                  likes: mtxAux[idx].likes,
                  liked: mtxAux[idx].liked,
                  color: mtxAux[idx].liked === 1 ? "green" : "white",
                  edited: mtxAux[idx].edited,
                  is_owner: mtxAux[idx].is_owner,
                });
                vexAux.push(aux);
              }
            }
            showAux[i].info = vexAux;
          }
          setState({
            ...state,
            fetched: true,
            fiComment: listAux,
            // secComment: mtxAux,
            dispAns: showAux,
          });
        })
        .catch((err) => {
          setState({ ...state, fetched: true });
          alert(
            "Houve um problema nos comentarios",
            "Deseja Recarregar a pagina",
            [
              {
                label: "Sim",
                onClick: () => {
                  window.location.reload();
                },
              },
              {
                label: "Não",
              },
            ]
          );
        });
    }
  }, []);
  return (
    <div>
      <CRow>
        <CCol sm="12">
          <div>
            <CBreadcrumb
              style={{ width: "95%", marginLeft: "1.7%", display: "flex" }}
            >
              <div style={{ width: "7%", height: "100%" }}>
                <img
                  src={state.avatar}
                  width="44"
                  height="44"
                  style={{
                    borderRadius: "40%",
                  }}
                />
              </div>
              <div style={{ width: "90%" }}>
                <div style={{ width: "100%", color: "white" }}>
                  <div style={{ width: "100%" }}>
                    <input
                      // id="contenteditable-root"
                      onClick={() => comment()}
                      dir="auto"
                      value={state.newComment}
                      placeholder="Adicionar um comentário público.."
                      // class="style-scope yt-formatted-string"
                      // value
                      onChange={(e) => {
                        setState({ ...state, newComment: e.target.value });
                      }}
                      style={{
                        color: "white",
                        width: "100%",
                        border: "1px solid white",
                        borderTop: "none",
                        borderRight: "none",
                        borderLeft: "none",
                        background: "transparent",
                      }}
                    ></input>
                  </div>
                </div>
                {display.showComment && (
                  <div style={{ width: "100%", marginTop: "3px" }}>
                    <a
                      class="myCancel"
                      onClick={() => exitComment()}
                      style={{ marginLeft: "76%", color: "white" }}
                    >
                      Cancelar
                    </a>
                    <a
                      class="myBut "
                      onClick={() => sendCom(state.newComment, 0, "", "")}
                      style={{ marginLeft: "1%", color: "black" }}
                    >
                      Enviar
                    </a>
                  </div>
                )}
              </div>
            </CBreadcrumb>
            {!state.fetched && (
              <div>
                <div className="div-reload">
                  <CIcon className="icone" name="cilReload" size="3xl" />
                </div>
              </div>
            )}
            {state.fiComment.map((item, index) => (
              <div
                style={{
                  width: "95%",
                  marginLeft: "3%",
                  display: "flex",
                  marginTop: "1%",
                }}
              >
                <div style={{ width: "7%", height: "100%" }}>
                  <img
                    src={item.src}
                    width="44"
                    height="44"
                    onClick={() => handleClick("channel", item.user_id)}
                    style={{
                      borderRadius: "40%",
                      cursor: "pointer",
                    }}
                  />
                </div>
                {item.is_owner &&
                item.id === display.idEdit &&
                display.editing ? (
                  <div
                    style={{
                      width: "95%",
                      // marginLeft: "1.7%",
                      // display: "flex",
                    }}
                  >
                    <CBreadcrumb
                      style={{
                        width: "95%",
                        marginLeft: "1.7%",
                        display: "flex",
                      }}
                    >
                      <div style={{ width: "90%" }}>
                        <div style={{ width: "100%", color: "white" }}>
                          <div style={{ width: "100%" }}>
                            <input
                              // id="contenteditable-root"

                              dir="auto"
                              value={display.oldComment}
                              placeholder="Adicionar um comentário público.."
                              // class="style-scope yt-formatted-string"
                              // value
                              onChange={(e) => {
                                setDisplay({
                                  ...display,
                                  oldComment: e.target.value,
                                });
                              }}
                              style={{
                                color: "white",
                                width: "100%",
                                border: "1px solid white",
                                borderTop: "none",
                                borderRight: "none",
                                borderLeft: "none",
                                background: "transparent",
                              }}
                            ></input>
                          </div>
                        </div>

                        <div style={{ width: "100%", marginTop: "3px" }}>
                          <a
                            class="myCancel"
                            onClick={() => exitEdit()}
                            style={{ marginLeft: "50%", color: "white" }}
                          >
                            Cancelar
                          </a>
                          <a
                            class="myBut "
                            onClick={() =>
                              sendEdit(display.oldComment, display.idEdit, 0)
                            }
                            style={{ marginLeft: "1%", color: "black" }}
                          >
                            Enviar
                          </a>
                        </div>
                      </div>
                    </CBreadcrumb>
                  </div>
                ) : (
                  <div class="showDiv" style={{ width: "90%", color: "white" }}>
                    <div style={{ width: "100%", display: "flex" }}>
                      <span style={{ width: "98%" }}>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClick("channel", item.user_id)}
                        >
                          {item.nickname}
                        </span>
                        <span style={{ padding: "5px" }}> {item.date} </span>
                        <span>{item.edited && "(editado)"}</span>
                      </span>
                      {item.is_owner ? (
                        <div
                          style={{
                            display: "flex",
                            width: "3%",
                          }}
                        >
                          <div
                            class="showReport"
                            style={{
                              // width: "1.5%",
                              alignItems: "center",
                            }}
                            onClick={() =>
                              editingComment(item.comment, item.id)
                            }
                          >
                            <CIcon
                              name="cil-pencil"
                              style={{ marginLeft: "5px" }}
                            />
                          </div>
                          <div
                            class="showReport"
                            style={{
                              // width: "1.5%",
                              alignItems: "center",
                            }}
                            onClick={() => deletCom(item.id, 0, 0)}
                          >
                            <CIcon
                              name="cil-trash"
                              style={{ marginLeft: "5px" }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          class="showReport"
                          style={{
                            width: "3%",
                            alignItems: "center",
                          }}
                          onClick={() => reportComment()}
                        >
                          <CIcon
                            name="cilFlagAlt"
                            style={{ marginLeft: "5px" }}
                          />
                        </div>
                      )}
                    </div>
                    <p>{item.comment}</p>
                    <div>
                      <CButton
                        style={{ color: item.color, marginLeft: "-1.1%" }}
                        onClick={() =>
                          Liked("like", 0, item.id, 0, item.is_owner)
                        }
                      >
                        <CIcon name="cilThumbUp" /> {item.likes}
                      </CButton>
                      <CButton
                        style={{ color: "white" }}
                        onClick={() => answers(1, item.id)}
                      >
                        Responder
                      </CButton>
                      {display.showAns && state.idAns === item.id && (
                        <div
                          style={{
                            width: "95%",
                            marginLeft: "1.7%",
                            display: "flex",
                          }}
                        >
                          <div style={{ width: "7%", height: "100%" }}>
                            <img
                              src={state.avatar}
                              style={{
                                borderRadius: "40%",
                              }}
                              width="44"
                              height="44"
                            />
                          </div>
                          <div style={{ width: "90%" }}>
                            <div style={{ width: "100%", color: "white" }}>
                              <div style={{ width: "100%" }}>
                                <input
                                  dir="auto"
                                  value={state.AnswersOne}
                                  placeholder="Adicionar um comentário público.."
                                  onChange={(e) => {
                                    setState({
                                      ...state,
                                      AnswersOne: e.target.value,
                                    });
                                  }}
                                  style={{
                                    color: "white",
                                    width: "100%",
                                    border: "1px solid white",
                                    borderTop: "none",
                                    borderRight: "none",
                                    borderLeft: "none",
                                    background: "transparent",
                                  }}
                                ></input>
                              </div>
                            </div>
                            <div style={{ width: "100%", marginTop: "3px" }}>
                              <a
                                class="myCancel"
                                onClick={() => exitAns(1)}
                                style={{ marginLeft: "66%", color: "white" }}
                              >
                                Cancelar
                              </a>
                              <a
                                class="myBut "
                                onClick={() =>
                                  sendCom(state.AnswersOne, 1, state.idAns, "")
                                }
                                style={{ marginLeft: "1%", color: "black" }}
                              >
                                Enviar
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {state.dispAns[index].info.length !== 0 && (
                      <div>
                        {state.dispAns[index].dis && (
                          <div>
                            {state.dispAns[index].info.map((itm, idx) => (
                              <div
                                style={{
                                  width: "95%",
                                  marginLeft: "3%",
                                  display: "flex",
                                  marginTop: "1%",
                                }}
                              >
                                <div style={{ width: "7%", height: "100%" }}>
                                  <img
                                    src={itm[0].src}
                                    width="44"
                                    height="44"
                                    onClick={() =>
                                      handleClick("channel", itm[0].user_id)
                                    }
                                    style={{
                                      borderRadius: "40%",
                                      cursor: "pointer",
                                    }}
                                  />
                                </div>
                                {itm[0].is_owner &&
                                itm[0].id === display.idEdit &&
                                display.editing ? (
                                  <div
                                    style={{
                                      width: "95%",
                                    }}
                                  >
                                    <CBreadcrumb
                                      style={{
                                        width: "95%",
                                        marginLeft: "1.7%",
                                        display: "flex",
                                      }}
                                    >
                                      <div style={{ width: "90%" }}>
                                        <div
                                          style={{
                                            width: "100%",
                                            color: "white",
                                          }}
                                        >
                                          <div style={{ width: "100%" }}>
                                            <input
                                              dir="auto"
                                              value={display.oldComment}
                                              placeholder="Adicionar um comentário público.."
                                              onChange={(e) => {
                                                setDisplay({
                                                  ...display,
                                                  oldComment: e.target.value,
                                                });
                                              }}
                                              style={{
                                                color: "white",
                                                width: "100%",
                                                border: "1px solid white",
                                                borderTop: "none",
                                                borderRight: "none",
                                                borderLeft: "none",
                                                background: "transparent",
                                              }}
                                            ></input>
                                          </div>
                                        </div>

                                        <div
                                          style={{
                                            width: "100%",
                                            marginTop: "3px",
                                          }}
                                        >
                                          <a
                                            class="myCancel"
                                            onClick={() => exitEdit()}
                                            style={{
                                              marginLeft: "50%",
                                              color: "white",
                                            }}
                                          >
                                            Cancelar
                                          </a>
                                          <a
                                            class="myBut "
                                            onClick={() =>
                                              sendEdit(
                                                display.oldComment,
                                                display.idEdit,
                                                1
                                              )
                                            }
                                            style={{
                                              marginLeft: "1%",
                                              color: "black",
                                            }}
                                          >
                                            Enviar
                                          </a>
                                        </div>
                                      </div>
                                    </CBreadcrumb>
                                  </div>
                                ) : (
                                  <div
                                    class="showDivSec"
                                    style={{ width: "90%", color: "white" }}
                                  >
                                    <div
                                      style={{ width: "100%", display: "flex" }}
                                    >
                                      <span style={{ width: "95%" }}>
                                        {" "}
                                        <span
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleClick(
                                              "channel",
                                              itm[0].user_id
                                            )
                                          }
                                        >
                                          {itm[0].nickname}
                                        </span>
                                        <span style={{ padding: "5px" }}>
                                          {itm[0].date}{" "}
                                        </span>
                                        <span>
                                          {itm[0].edited && "(editado)"}
                                        </span>
                                      </span>

                                      {itm[0].is_owner ? (
                                        <div
                                          style={{
                                            display: "flex",
                                            width: "3%",
                                          }}
                                        >
                                          <div
                                            class="showReportSec"
                                            style={{
                                              alignItems: "center",
                                            }}
                                            onClick={() =>
                                              editingComment(
                                                itm[0].comment,
                                                itm[0].id
                                              )
                                            }
                                          >
                                            <CIcon
                                              name="cil-pencil"
                                              style={{ marginLeft: "5px" }}
                                            />
                                          </div>
                                          <div
                                            class="showReportSec"
                                            style={{
                                              alignItems: "center",
                                            }}
                                            onClick={() =>
                                              deletCom(itm[0].id, 1, item.id)
                                            }
                                          >
                                            <CIcon
                                              name="cil-trash"
                                              style={{ marginLeft: "5px" }}
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div
                                          class="showReportSec"
                                          style={{
                                            width: "3%",
                                            alignItems: "center",
                                          }}
                                          onClick={() => reportComment()}
                                        >
                                          <CIcon
                                            name="cilFlagAlt"
                                            style={{ marginLeft: "5px" }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <p>{itm[0].comment}</p>
                                    <div>
                                      <CButton
                                        style={{
                                          color: itm[0].color,
                                          marginLeft: "-1.1%",
                                        }}
                                        onClick={() =>
                                          Liked(
                                            "like",
                                            1,
                                            itm[0].id,
                                            state.dispAns[index].id,
                                            itm[0].is_owner
                                          )
                                        }
                                      >
                                        <CIcon name="cilThumbUp" />{" "}
                                        {itm[0].likes}
                                      </CButton>
                                      <CButton
                                        style={{ color: "white" }}
                                        onClick={() => answers(2, itm[0].id)}
                                      >
                                        Responder
                                      </CButton>
                                      {display.showAnsTwo &&
                                        state.idAnsTwo === itm[0].id && (
                                          <div
                                            style={{
                                              width: "95%",
                                              marginLeft: "1.7%",
                                              display: "flex",
                                            }}
                                          >
                                            <div
                                              style={{
                                                width: "7%",
                                                height: "100%",
                                              }}
                                            >
                                              <img
                                                src={state.avatar}
                                                width="44"
                                                height="44"
                                                style={{
                                                  borderRadius: "40%",
                                                }}
                                              />
                                            </div>
                                            <div style={{ width: "90%" }}>
                                              <div
                                                style={{
                                                  width: "100%",
                                                  color: "white",
                                                }}
                                              >
                                                <div style={{ width: "100%" }}>
                                                  <input
                                                    dir="auto"
                                                    value={state.AnswersTwo}
                                                    placeholder="Adicionar um comentário público.."
                                                    onChange={(e) => {
                                                      setState({
                                                        ...state,
                                                        AnswersTwo:
                                                          e.target.value,
                                                      });
                                                    }}
                                                    style={{
                                                      color: "white",
                                                      width: "100%",
                                                      border: "1px solid white",
                                                      borderTop: "none",
                                                      borderRight: "none",
                                                      borderLeft: "none",
                                                      background: "transparent",
                                                    }}
                                                  ></input>
                                                </div>
                                              </div>

                                              <div
                                                style={{
                                                  width: "100%",
                                                  marginTop: "3px",
                                                }}
                                              >
                                                <a
                                                  class="myCancel"
                                                  onClick={() => exitAns(2)}
                                                  style={{
                                                    marginLeft: "66%",
                                                    color: "white",
                                                  }}
                                                >
                                                  Cancelar
                                                </a>
                                                <a
                                                  class="myBut "
                                                  onClick={() =>
                                                    sendCom(
                                                      state.AnswersTwo,
                                                      2,
                                                      item.id,
                                                      itm[0].nickname
                                                    )
                                                  }
                                                  style={{
                                                    marginLeft: "1%",
                                                    color: "black",
                                                  }}
                                                >
                                                  Enviar
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div>
                          <>
                            {state.dispAns[index].dis ? (
                              <CButton
                                class="showAnswers"
                                onClick={() => showAns(index, item.id)}
                              >
                                <CIcon
                                  name="cilCaretTop"
                                  style={{ marginRight: "10px" }}
                                />
                                Ocultar {state.dispAns[index].info.length}{" "}
                                Respostas
                              </CButton>
                            ) : (
                              <CButton
                                class="showAnswers"
                                onClick={() => showAns(index, item.id)}
                              >
                                <CIcon
                                  name="cilCaretBottom"
                                  style={{ marginRight: "10px" }}
                                />
                                Ver {state.dispAns[index].info.length} Respostas
                              </CButton>
                            )}
                          </>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CCol>
      </CRow>
      <br></br>
      <br></br>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
