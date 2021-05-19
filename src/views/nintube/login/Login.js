//REACT
import React, { useEffect, useState } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//Style
//API
import { alert } from "../../../util/alertApi";
import { loginUser } from "../../../util/Api";
import md5 from "md5";

const Login = ({ history, setUser }) => {
  const [state, setState] = useState({
    error: "",
    message: "",
    email: "",
    password: "",
  });

  const handleKeys = (e, func) => {
    if (e.keyCode === 13) {
      func(e);
    }
  };
  const login = (e) => {
    e.preventDefault();
    setState({ ...state, error: "", message: "Logando..." });
    var data = {
      email: state.email,
      password: md5(state.password),
    };
    if (!data.email || !data.password) {
      setState({
        ...state,
        error: "Insira os dados corretamente!",
        message: "",
      });
    } else {
      loginUser(data)
        .then(function (data) {
          if (data.status === 1) {
            var user = {
              token: data.token,
              id: data.id,
              username: data.username,
            };
            setUser(user);
            history.push("/home");
          }
          if (data.status === 0) {
            setState({ ...state, error: data.errorMessage, message: "" });
          }
        })
        .catch((err) => {
          setState({ ...state, error: "Dados inválidos", message: "" });
        });
    }
  };

  const forgotPassword = () => {
    history.push("/send_email");
  };

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer style={{ width: "50%" }}>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard style={{ width: "30%" }} className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    {state.message && (
                      <CCard
                        className="border-success"
                        style={{ textAlign: "center" }}
                      >
                        {state.message}
                      </CCard>
                    )}
                    {state.error && (
                      <CCard
                        className="border-danger"
                        style={{ textAlign: "center" }}
                      >
                        {state.error}
                      </CCard>
                    )}
                    <p className="text-muted">Entre em sua Conta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        placeholder="Email"
                        onChange={(e) => {
                          state.email = e.target.value;
                        }}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        onKeyUp={(e) => handleKeys(e, login)}
                        type="password"
                        placeholder="Senha"
                        onChange={(e) => {
                          state.password = e.target.value;
                        }}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          onClick={(e) => login(e)}
                          color="primary"
                          className="px-4"
                        >
                          Login
                        </CButton>
                      </CCol>

                      <CCol xs="6" className="text-right">
                        <CButton
                          onClick={() => forgotPassword()}
                          color="link"
                          className="px-0"
                        >
                          Esqueceu a senha?
                        </CButton>
                      </CCol>
                    </CRow>
                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      onClick={() => history.push("/register")}
                    >
                      Registrar Agora
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Login);
