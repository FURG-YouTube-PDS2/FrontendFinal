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
  CCol,
} from "@coreui/react";
//Componets
//Style
//API

function noVideo() {
  // let history = useHistory();
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol xs="12" md="5">
            <h1 style={{ color: "white" }}>
              :( Infelizmente não há conteúdo aqui
            </h1>
            {/* <div align="center">
                  <CButton
                    style={{ border: "1px solid red" }}
                    onClick={() => history.push("/upload")}
                  >
                    Inse
                  </CButton>
                </div> */}
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(noVideo);
