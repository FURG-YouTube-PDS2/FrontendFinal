//REACT
import React, { useEffect, useState } from "react";
import { findDOMNode } from "react-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CCardHeader,
  CCard,
  CCardBody,
  CDataTable,
  CBadge,
  CButton,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//Style
import "../components/componentStyle.css";
//API
import data from "./data";
import { myVideos, deletVideo, API_URL } from "../../../util/Api";
import { alert } from "../../../util/alertApi";

const fields = [
  { key: "thumb", _style: { width: "20%" }, sorter: false, filter: false },
  { key: "titulo", _style: { width: "35%" } },
  {
    key: "privacidade",
    _style: { width: "5%" },

    filter: false,
  },
  { key: "criado", _style: { width: "40%" } },
  {
    key: "Editar",
    label: "",

    sorter: false,
    filter: false,
  },
  {
    key: "Deletar",
    label: "",
    sorter: false,
    filter: false,
  },
];

const Studio = ({ user, history }) => {
  const [state, setState] = useState({
    fetched: false,
    videos: [],
  });
  const Delete = (video_id) => {
    var data = { video_id: video_id };
    let vet_playlist = [];
    for (let index = 0; index < state.videos.length; index++) {
      if (state.videos[index].id !== video_id) {
        vet_playlist.push(state.videos[index]);
      }
    }
    setState({ ...state, videos: vet_playlist });
    deletVideo(data)
      .then(function (data) {
        alert("Ação", "Video foi deletado com sucesso!");
      })
      .catch((err) => {
        alert(
          "Ação",
          "Ouve algume erro ao deletar o video, por favor tentar novamente mais tarde!"
        );
      });
  };

  useEffect(() => {
    if (!state.fetched) {
      if (user === null || user === "") {
        alert(
          "Houve um problema",
          "Você não está logado para realizar essa ação por favor realize o login.",
          [
            {
              label: "Cancelar",
              onClick: () => {
                history.push("/home");
              },
            },
            {
              label: "Login",
              onClick: () => {
                history.push("/login");
              },
            },
          ]
        );
      } else {
        var data = { token: user.token };
        myVideos(data)
          .then(function (data) {
            var videos = [];
            for (let i = 0; i < data.length; i++) {
              var date = new Date(data[i][0].created_at);
              videos.push({
                id: data[i][0].id,
                thumb: data[i][0].thumb,
                titulo: data[i][0].title,
                privacidade: data[i][0].privacy,
                criado:
                  date.getDate() +
                  "/" +
                  (date.getMonth() + 1) +
                  "/" +
                  date.getFullYear(),
              });
            }

            setState({ ...state, fetched: true, videos });
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
        // setState({ ...state, fetched: true });
      }
    }
  }, []);
  return (
    <div
      style={{
        height: "100%",
      }}
    >
      {!state.fetched && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      {state.videos.length !== 0 ? (
        <div>
          <CCard>
            <CCardHeader>Conteúdo do Canal</CCardHeader>
            <CCardBody>
              {/* {state.videos.map((item, index) => (
            <CCard>

              <CImg
                style={{
                  width: "30%",
                }}
                src={item[0].thumb}
              ></CImg>
              <span>item[0].title</span>
            </CCard>
          ))} */}

              <div align="center">
                <CButton
                  color="success"
                  onClick={() => history.push("/upload")}
                >
                  <CIcon name="cil-cloud-upload" /> Enviar Vídeo
                </CButton>
              </div>

              <CDataTable
                items={state.videos}
                fields={fields}
                hover
                striped
                // columnFilter
                itemsPerPageSelect
                itemsPerPage={5}
                // sorter
                // dark="true"
                pagination
                scopedSlots={{
                  thumb: (item) => (
                    <td>
                      <img
                        style={{
                          width: "100%",
                          height: "160px",
                          cursor: "pointer",
                          borderBottom: "1px solid black",
                          borderRadius: "10px",
                        }}
                        onClick={() => history.push("/view/" + item.id)}
                        src={API_URL + "images/getImage/" + item.id}
                      />
                    </td>
                  ),
                  titulo: (item) => <td>{item.titulo}</td>,
                  privacidade: (item) => (
                    <td>{item.privacidade ? "Privado" : "Publico"}</td>
                  ),
                  criado: (item) => <td>{item.criado}</td>,
                  Editar: (item) => (
                    <td className="align-middle">
                      <CButton
                        title="Editar"
                        color="btn btn-ghost-dark"
                        onClick={() => history.push("/edit/upload/" + item.id)}
                      >
                        <CIcon name="cil-pencil" />
                      </CButton>
                    </td>
                  ),
                  Deletar: (item) => (
                    <td className="align-middle">
                      <CButton
                        color="btn btn-ghost-danger"
                        title="Deletar"
                        onClick={() => {
                          Delete(item.id);
                        }}
                      >
                        <CIcon name="cil-trash" />
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </div>
      ) : (
        <div
          align="center"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="c-app c-default-layout flex-row align-items-center"
        >
          {" "}
          <div style={{ marginTop: "-20%" }} className="justify-content-center">
            <h3 style={{ color: "white" }}>Não há videos no seu canal!</h3>{" "}
            <h3 style={{ color: "white" }}>Click Abaixo</h3>
            <CButton color="success" onClick={() => history.push("/upload")}>
              <CIcon name="cil-cloud-upload" /> Enviar Primeiro Vídeo
            </CButton>
          </div>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Studio);
