//React
import React, { useState, useEffect, Component } from "react";
import { useHistory, useParams } from "react-router-dom";
//CoreUi
import {
  CContainer,
  CCard,
  CRow,
  CCol,
  CForm,
  CSelect,
  CCardBody,
  CCardHeader,
  CFormText,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CLabel,
  CInput,
  CFormGroup,
  CDropdown,
  CDropdownItem,
  CDropdownToggle,
  CDropdownMenu,
  CImg,
} from "@coreui/react";
//Api
import { alert } from "../../../util/alertApi";
import { editPass, API_URL, getImg } from "../../../util/Api";
import md5 from "md5";
//Style
import "./forgotPass.css";

const Forgot = ({ history }) => {
  let id = useParams();

  const handleClick = (route) => {
    history.push("/" + route);
  };
  const [state, setState] = useState({
    fetched: false,
    password_new: "",
    password_confirm: "",
    error: "",
    message: "",
    img: "",
  });

  const changePass = () => {
    // e.preventDefault();

    setState({ ...state, error: "", message: "Alterando..." });

    var password = "";
    if (!state.password_confirm || !state.password_new) {
      setState({
        ...state,
        error: "Por favor, inserir valores em todos os campos",
        message: "",
      });
    } else if (state.password_confirm !== state.password_new) {
      setState({
        ...state,
        error: "As senhas não batem. Tente novamente!",
        message: "",
      });
    } else {
      password = md5(state.password_new);

      var Newdata = {
        id: id.id, // Nao sei pq krl isso ta acontencendo porem msm se eu fizesse data-{ id } o id ficava id.id
        password: password,
      };
      // data.append("id", id);
      // data.append("password", password);

      editPass(Newdata)
        .then(function (data) {
          if (data.status === 1) {
            setState({
              ...state,
              error: "",
              message: "Senha Atualizada",
            });
            alert("Senha Atualizada!", "Redirecionando para o login", [
              {
                label: "Ok",
                onClick: () => {
                  history.push("/login");
                },
              },
            ]);
          } else {
            setState({
              ...state,
              error: "Algo deu errado tentar novamente!",
              message: "",
            });
          }
        })
        .catch((err) => {
          setState({ ...state, error: "Dados inválidos", message: "" });
        });
    }
  };

  useEffect(() => {
    if (!state.fetched) {
      var req = {
        name: "banner_bordBlack",
      };
      getImg(req).then(function (data) {
        var img = data;
        setState({
          ...state,
          img: img,
          fetched: true,
        });
      });
      if (!id) {
        history.push("/login");
      }
    }
  }, []);

  return (
    <div className="confirm">
      <div id="divBut">
        <div>
          <CRow class="msg">
            <CCard className="border-success">
              <CCard>
                <CImg
                  style={{ width: "100%" }}
                  className="c-sidebar-brand-full"
                  src={state.img}
                />
              </CCard>
              <CCardBody>
                {state.error && (
                  <CCard
                    className="border-danger"
                    style={{ textAlign: "center", color: "black" }}
                  >
                    {state.error}
                  </CCard>
                )}
                <h3 id="align">Cadastre uma nova senha abaixo:</h3>

                <p>
                  <CCol>
                    <CForm>
                      <CFormGroup>
                        <CLabel id="lb" htmlFor="nf-password">
                          Senha
                        </CLabel>
                        <CInput
                          type="password"
                          id="nf-password"
                          name="nf-password"
                          // value={state.pass.password_new}
                          autoComplete="current-password"
                          onChange={(e) => {
                            let user = { ...state.pass };
                            // user.password_new = e.target.value;
                            setState({
                              ...state,
                              password_new: e.target.value,
                            });
                          }}
                        />
                      </CFormGroup>

                      <CFormGroup>
                        <CLabel id="lb" htmlFor="nf-password_confirm">
                          Confirme a senha
                        </CLabel>
                        <CInput
                          type="password"
                          id="nf-password_confirm"
                          name="nf-password_confirm"
                          autoComplete="password_confirm"
                          // value={state.pass.password_confirm}
                          onChange={(e) => {
                            // let pass = { ...state.pass };
                            // user.password_confirm = e.target.value;
                            setState({
                              ...state,
                              password_confirm: e.target.value,
                            });
                          }}
                        />
                      </CFormGroup>
                    </CForm>
                  </CCol>
                  <div align="center">
                    <CButton onClick={() => changePass()} class="myButton">
                      Enviar
                    </CButton>
                  </div>
                </p>
              </CCardBody>
            </CCard>
          </CRow>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
