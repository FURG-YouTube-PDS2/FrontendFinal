//REACT
import React, { useEffect, useState } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
// import socketIOClient from "socket.io-client";
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
} from "@coreui/react";
//Componets
import HomeVideos from "../components/homeVideos";
//Style
//API

const Home = ({ history, user }) => {
  const [state, setState] = useState({
    fetched: false,
  });
  useEffect(() => {
    if (!state.fetched) {
      setState({ ...state, fetched: true });
    }
  }, [state]);
  const handleClick = () => {
    history.push("/view");
  };

  const [response, setResponse] = useState("");

  /*useEffect(() => {
    const socket = socketIOClient("http://localhost:3334");
    socket.on("FromAPI", (data) => {
    });
  }, []);*/

  return (
    <div>
      <HomeVideos />
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Home);
