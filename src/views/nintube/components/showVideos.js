//REACT
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import NoVideo from "./noVideo";
//API
import { Registrations, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
//Style
import "./componentStyle.css";

const ShowVideos = ({ user }) => {
  const [state, setState] = useState({
    videos: [],
    channels: [],
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
        token: user ? user.token : "",
      };
      Registrations(data)
        .then(function (data) {
          var channels = [];
          for (let index = 0; index <= 14; index++) {
            channels.push(data.channels[0]);
          }
          setState({
            ...state,
            fetched: true,
            videos: data.videos,
            channels: data.channels,
          });
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
        <div>
          {state.channels.length >= 15 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                overflowX: "scroll",
                width: "100%",
                height: "100%",
                marginBottom: "2%",
              }}
            >
              {state.channels.map((channel) => (
                <div
                  style={{
                    display: "flex",

                    flexDirection: "column",
                    marginRight: "2%",
                    textAlign: "center",
                    // width: "200px",
                    // height: "100px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <CImg
                    src={API_URL + "images/getImage/" + channel.id}
                    style={{
                      // width: "100%", height: "100%",
                      width: "80px",
                      height: "80px",
                      cursor: "pointer",
                    }}
                    className="c-avatar-img"
                    onClick={() => history.push("/channel/" + channel.id)}
                  />

                  <span
                    onClick={() => history.push("/channel/" + channel.id)}
                    style={{
                      color: "white",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    {channel.username}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                // width: "100%",
                // height: "100%",
                marginBottom: "2%",
              }}
            >
              {state.channels.map((channel) => (
                <div
                  style={{
                    display: "flex",

                    flexDirection: "column",
                    marginRight: "2%",
                    textAlign: "center",
                    // width: "200px",
                    // height: "80px",
                    // width: "100%",
                    // height: "100%",
                  }}
                >
                  <CImg
                    src={API_URL + "images/getAvatar/" + channel.id}
                    style={{ width: "80px", height: "80px", cursor: "pointer" }}
                    className="c-avatar-img"
                    onClick={() => history.push("/channel/" + channel.id)}
                  />

                  <span
                    onClick={() => history.push("/channel/" + channel.id)}
                    style={{
                      color: "white",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    {channel.username}
                  </span>
                </div>
              ))}
            </div>
          )}
          <CContainer fluid>
            <CRow>
              {state.videos.map((item, index) => (
                <CCol style={{ width: "5%" }} sm="2">
                  <CCard style={{ border: "2px solid #B3272C" }}>
                    <CImg
                      onClick={() => handleClick("view", item.id)}
                      style={{
                        width: "100%",
                        height: "150px",
                        cursor: "pointer",
                        borderBottom: "1px solid black",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.id}
                    />
                    <div>
                      <CCardBody style={{ fontSize: "80%" }}>
                        <h3
                          onClick={() => handleClick("view", item.id)}
                          style={{ fontSize: "120%", cursor: "pointer" }}
                        >
                          {item.title.length <= 103
                            ? item.title
                            : item.title.substring(0, 100) + "..."}
                        </h3>{" "}
                        <CCardText
                          style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                        >
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleClick("channel", item.channel_id)
                            }
                          >
                            {item.channel}
                          </span>
                          <CCardText
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("view", item.id)}
                          >{`${item.views} • ${diffDate(
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
      ) : (
        <NoVideo />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ShowVideos);
