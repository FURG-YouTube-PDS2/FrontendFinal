//REACT
import React, { useEffect, useState } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
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
  CSwitch,
  CInputGroup,
  CInput,
  CInputGroupAppend,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
import HistVideo from "../components/histVideos";
import LogoutPage from "../components/logoutPage";
//Style
//API

const modes = [
  { variant: "outline", shape: "pill", title: "Histórico de exibição" },
  { variant: "outline", shape: "pill", title: "Histórico de enquete" },
  { variant: "outline", shape: "pill", title: "Comentários" },
  { variant: "outline", shape: "pill", title: "Comunidade" },
  { variant: "outline", shape: "pill", title: "Chat ao vivo" },
];
const colors = ["dark"];

const Historic = ({ user, history }) => {
  const [state, setState] = useState({
    fetched: false,
  });
  useEffect(() => {
    if (!state.fetched) {
      setState({ ...state, fetched: true });
    }
  }, []);
  return (
    <div>
      {user != null && user !== "" ? (
        <>
          <h4 align="center">Histórico de Exibição</h4>
          <HistVideo />
        </>
      ) : (
        <LogoutPage />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Historic);
