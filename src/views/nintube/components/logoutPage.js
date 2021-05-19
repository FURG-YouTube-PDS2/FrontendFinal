//REACT
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CCard,
  CCardBody,
  CButton,
  CContainer,
  CRow,
  CBreadcrumb,
  CCol,
} from "@coreui/react";
//Componets
//Style
//API

function LogouPage() {
  let history = useHistory();
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs="12" md="5">
            <CBreadcrumb>
              <h1>Faça login para visualizar este conteúdo.</h1>
              <div align="center" style={{ width: "100%" }}>
                <CButton
                  style={{
                    border: "1px solid red",
                    color: "white",
                    width: "150px",
                  }}
                  onClick={() => history.push("/login")}
                >
                  Login
                </CButton>
              </div>
            </CBreadcrumb>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(LogouPage);
