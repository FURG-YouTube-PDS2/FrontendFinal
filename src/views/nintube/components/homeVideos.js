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
  CCardSubtitle,
  CCardText,
  CCardHeader,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
//API
import { feedVideos, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
import { alert } from "../../../util/alertApi";
//Style
import "./componentStyle.css";

const HomeVideos = ({ user }) => {
  const [state, setState] = useState({
    videos: [],
    fetched: false,
    today: new Date(),
  });
  let history = useHistory();
  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
  };
  useEffect(() => {
    if (!state.fetched) {
      var data = {
        numberSkip: 0,
        token: user ? user.token : "",
      };

      feedVideos(data)
        .then(function (data) {
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
            // {
            //   label: "Login",
            //   onClick: () => {
            //     history.push("/login");
            //   },
            // },
          ]);
        });
    }
  }, []);
  return (
    <div>
      {state.videos.length === 0 && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}

      <CContainer fluid>
        <CRow>
          {state.videos.map((item, index) => (
            <CCol sm="4">
              <CCard style={{ border: "2px solid #B3272C" }}>
                <CImg
                  onClick={() => handleClick("view", item.id)}
                  style={{
                    width: "100%",
                    height: "250px",
                    cursor: "pointer",
                    borderBottom: "1px solid black",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                  src={API_URL + "images/getImage/" + item.id}
                />
                <div>
                  <CCardBody
                    className=" float-left"
                    style={{ height: "100px" }}
                  >
                    <div className="c-avatar">
                      <CImg
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("channel", item.id)}
                        src={API_URL + "images/getAvatar/" + item.channel_id}
                        className="c-avatar-img"
                        alt="admin@bootstrapmaster.com"
                      />
                    </div>
                  </CCardBody>
                  <CCardBody>
                    <CCardSubtitle
                      style={{ cursor: "pointer" }}
                      onClick={() => handleClick("view", item.id)}
                    >
                      {item.title.length <= 103
                        ? item.title
                        : item.title.substring(0, 100) + "..."}
                    </CCardSubtitle>{" "}
                    <CCardText
                      style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                    >
                      {" "}
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("channel", item.channel_id)}
                      >
                        {item.channel}
                      </span>
                      <CCardText
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("view", item.id)}
                      >{`${item.views} Visualizações • ${diffDate(
                        state.today,
                        item.date
                      )}`}</CCardText>{" "}
                    </CCardText>
                  </CCardBody>
                </div>
              </CCard>
            </CCol>
          ))}
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(HomeVideos);
