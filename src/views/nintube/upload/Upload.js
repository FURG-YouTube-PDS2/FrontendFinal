import React, { useState, useEffect } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CInput,
  CTextarea,
  CCard,
  CFormGroup,
  CCol,
  CSwitch,
  CButton,
  CLabel,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//Style
import "../styles/nintube.css";
//API
import Player from "../components/Player";
import { uploadVideo, getRec } from "../../../util/Api";
import { alert } from "../../../util/alertApi";
import Dropzone from "react-dropzone";
import Select, { components } from "react-select";

const Upload = ({ user, history }) => {
  const [state, setState] = useState({
    upload: "",
    description: "",
    title: "",
    privacy: false,
    video: null,
    video_name: "",
    thumb: null,
    fetched: false,
    image: "",
    video_url: "",
    display: true,
    recommend: [],
    selecteds: [],
  });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSelectChange = (selecteds) => {
    setState({ ...state, selecteds });
  };

  const onDrop = async (files) => {
    if (Math.round(files[0].size / 1024 >= 6144)) {
      alert("Opss", "O seu video tem mais de 6 Mb. Insira um video menor!");
    } else {
      setState({
        ...state,
        video: files[0],
        video_name: files[0].path,
        video_url: URL.createObjectURL(files[0]),
        // video_url: toBase64(files[0]),
      });
    }
    // const options = {
    //   onUploadProgess: (progressEvent) => {
    //     const { loaded, total } = progressEvent;
    //     let percent = Math.floor((loaded * 100) / total);
    //     // if (percent < 100) {
    //     //   setState({ ...state, upload_percent: percent });
    //     // }
    //   },
    // };
  };
  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>{children}</components.SingleValue>
  );
  const sendVideo = async () => {
    setState({
      ...state,
      display: false,
      error: "",
      message: "Fazendo upload do video...",
    });
    if (
      !state.video ||
      !state.description ||
      !state.title ||
      !state.thumb ||
      state.selecteds.length === 0
    ) {
      setState({
        ...state,
        error: "Campos não podem ficar em branco!",
        message: "",
      });
    } else {
      var type_video = state.video.type.split("/");
      if (type_video[0] !== "video") {
        setState({
          ...state,
          error: "Formato do video está errado!",
          message: "",
        });
      } else {
        const data = {
          title: state.title,
          file: await toBase64(state.video),
          thumb: await toBase64(state.thumb),
          description: state.description,
          privacy: state.privacy,
          tags: state.selecteds.map((tag) => {
            return tag.id;
          }),
        };

        uploadVideo(data, user.token)
          .then(function (data) {
            alert(
              "Sucesso!",
              "Seu vídeo foi criado com sucesso, escolha agora entre ver o seu vídeo ou adicionar novo vídeo",
              [
                {
                  label: "Novo Vídeo",
                  onClick: () => {
                    window.location.reload();
                  },
                },
                {
                  label: "Ver Vídeo",
                  onClick: () => {
                    history.push("/view/" + data.sent);
                  },
                },
              ]
            );
          })
          .catch((err) => {
            setState({ ...state, error: "Dados inválidos", message: "" });
          });
      }
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setState({
        ...state,
        thumb: event.target.files[0],
        image: URL.createObjectURL(event.target.files[0]),
      });
      // var thumb = event.target.files[0];
      // var thumb_name = event.target.files[0].name;
      // let reader = new FileReader();
      // reader.onload = (e) => {
      //   setState({
      //     ...state,
      //     thumb: thumb,
      //     thumb_name: thumb_name,
      //     image: e.target.result,
      //   });
      // };
      // reader.readAsDataURL(event.target.files[0]);
    }
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
        getRec()
          .then(function (data) {
            var recommend = data.map((tag) => {
              return { id: tag.id, value: tag.id, label: tag.name };
            });
            setState({ ...state, fetched: true, recommend });
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
    }
  }, []);

  return (
    <div style={{ border: "1px solid white", borderRadius: "10px" }}>
      <div style={{ padding: "1%" }}>
        {state.message && (
          <CCard className="border-success" style={{ textAlign: "center" }}>
            {state.message}
          </CCard>
        )}
        {state.error && (
          <CCard className="border-danger" style={{ textAlign: "center" }}>
            {state.error}
          </CCard>
        )}
        <CFormGroup
          row
          style={{
            // marginLeft: "2%",
            marginTop: "1%",
          }}
        >
          <CCol md="6">
            <h3 style={{ color: "white" }}>Título</h3>
            <CInput
              // style={{ height: "100%" }}
              // placeholder="Titulo"
              onChange={(e) => setState({ ...state, title: e.target.value })}
            />
          </CCol>
          <CCol md="6">
            <div
              style={{
                color: "white",

                // justifyContent: "space-between",
              }}
            >
              <h3 style={{ color: "white" }}>Thumb e Privacidade</h3>

              <div style={{ display: "flex" }}>
                <div>
                  <label className="fileThumb" for="file_thumb">
                    Selecione a imagem para a thumb &#187;
                  </label>
                  <input
                    id="file_thumb"
                    onChange={(e) => onImageChange(e)}
                    type="file"
                  ></input>{" "}
                </div>
                <div style={{ marginTop: "0.5%", display: "flex" }}>
                  <CSwitch
                    className={"mx-1"}
                    color={"success"}
                    onChange={(e) =>
                      setState({ ...state, privacy: e.target.checked })
                    }
                  />
                  <span>Privado</span>
                </div>
              </div>
            </div>
            {/* <div style={{ color: "white" }}> */}
          </CCol>
        </CFormGroup>
        {/* <CFormGroup row style={{ width: "50%" }}>
      <CCol md="12">
      <CTextarea
      placeholder="Descrição"
      style={{ height: "140%" }}
      onChange={(e) =>
      setState({
      ...state,
      description: e.target.value,
      })
      }
      />
      </CCol>
      </CFormGroup> */}
        <CFormGroup
          row
          // style={{ marginLeft: "2%" }}
        >
          <CCol md="6">
            <h3 style={{ color: "white" }}>Descrição</h3>
            <CTextarea
              // placeholder="Descrição"
              style={{ height: "30%" }}
              onChange={(e) =>
                setState({
                  ...state,
                  description: e.target.value,
                })
              }
            />
            <h3 style={{ color: "white", marginTop: "2%" }}>Tags</h3>
            <Select
              closeMenuOnSelect={false}
              options={state.recommend}
              placeholder="Tags"
              components={{ SingleValue }}
              onChange={handleSelectChange}
              isMulti
            />
            {/* </div> */}
          </CCol>
          <CCol md="6">
            <div style={{}}>
              <h3 style={{ color: "white", alignItems: "center" }}>
                Arraste ou Selecione o video!
              </h3>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
                  {({ getRootProps, getInputProps }) => (
                    <div
                      style={{
                        width: "300px",
                        height: "240px",
                        border: "1px solid lightgray",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <CIcon name="cilDataTransferUp" />
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>
            <p style={{ color: "white" }}>{state.video_name}</p>
          </CCol>
        </CFormGroup>

        <CFormGroup
          row
          // style={{ marginLeft: "2%" }}
        >
          <CCol md="6">
            {state.image && (
              <div align="center">
                <h3 style={{ color: "white" }}>Imagem Escolhido</h3>
                <img style={{ width: "60%" }} src={state.image} />
              </div>
            )}
          </CCol>
          <CCol md="6">
            {state.video_url && (
              <div align="center">
                <h3 style={{ color: "white" }}>Vídeo Escolhida</h3>
                {/* <iframe src={state.video_url}></iframe> */}
                <div style={{ width: "100%" }}>
                  <Player url={state.video_url} />
                </div>
              </div>
            )}
          </CCol>
        </CFormGroup>
        {state.display && (
          <div align="center" style={{ marginBottom: "1%", marginTop: "1%" }}>
            <CButton
              style={{ color: "white", border: "1px solid red" }}
              onClick={() => sendVideo()}
            >
              Enviar
            </CButton>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Upload);
