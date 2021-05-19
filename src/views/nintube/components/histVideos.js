//REACT
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  CCardHeader,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Compoment
import NoVideo from "./noVideo";
//Style
import "./componentStyle.css";
//API
import { historic, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";

const HistVideo = ({ user }) => {
  const [state, setState] = useState({
    fetched: false,
    videos: [],
  });
  let history = useHistory();
  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
  };
  useEffect(() => {
    if (!state.fetched) {
      if (user) {
        var data = {
          numberSkip: 0,
          token: user.token,
        };
      } else {
        var data = {
          numberSkip: 0,
          token: "",
        };
      }
      historic(data)
        .then(function (data) {
          // var array = new Array;
          // for (let i = 0; i < aray.length; i++) {
          //   const element = array[i];

          // }
          setState({ ...state, fetched: true, videos: data });
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
    <div>
      {!state.fetched && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      {state.videos.length !== 0 ? (
        <CContainer fluid>
          <CRow>
            <CCol sm="12">
              {state.videos.map((item, index) => (
                <CCard
                  style={{
                    marginBottom: "1%",
                    border: "2px solid #B3272C",
                  }}
                >
                  <CCardBody style={{ margin: "0" }}>
                    <CImg
                      onClick={() => handleClick("view", item.id)}
                      style={{
                        width: "15%",
                        height: "150px",
                        cursor: "pointer",
                        float: "left",
                        marginRight: "1%",
                        borderBottom: "1px solid black",
                        borderRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.id}
                    />
                    <CCardText>
                      <CCardText>
                        <h5
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClick("view", item.id)}
                        >
                          {item.title}
                          {/* {item.title.substring(0, 100) + "..."} */}
                        </h5>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClick("channel", item.c_id)}
                        >
                          {item.channel}
                        </span>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClick("view", item.id)}
                        >
                          {` • ${item.views}  Visualizações • ${diffDate(
                            state.today,
                            item.date
                          )}`}
                        </span>{" "}
                      </CCardText>
                      <CCardText
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("view", item.id)}
                      >
                        {item.description}
                      </CCardText>{" "}
                    </CCardText>
                  </CCardBody>
                </CCard>
              ))}
            </CCol>
          </CRow>
        </CContainer>
      ) : (
        <NoVideo />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(HistVideo);
