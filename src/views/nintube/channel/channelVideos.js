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
import NoVideo from "../components/noVideo";
//API
import { channelGetVideos, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";
//Style
import "../components/componentStyle.css";

const ChannelVideos = ({ user }) => {
  let { id } = useParams();
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
      if (user !== null && user !== "") {
        var data = {
          user_id: id !== "0" ? id : "",
          token: user.token,
        };
      } else {
        var data = {
          user_id: id !== "0" ? id : "",
          token: "",
        };
      }
      channelGetVideos(data)
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
      <CContainer fluid>
        <CRow>
          {state.videos.length === 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
              <NoVideo />
            </div>
          ) : (
            <>
              {state.videos.map((item, index) => (
                <CCol style={{ width: "5%" }} sm="2">
                  <CCard style={{ border: "2px solid #B3272C" }}>
                    <CImg
                      onClick={() => handleClick("view", item.video_id)}
                      style={{
                        width: "100%",
                        height: "150px",
                        cursor: "pointer",
                        borderBottom: "1px solid black",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.video_id}
                    />
                    <div>
                      <CCardBody style={{ fontSize: "80%" }}>
                        <h3
                          onClick={() => handleClick("view", item.video_id)}
                          style={{ fontSize: "120%", cursor: "pointer" }}
                        >
                          {item.title}
                        </h3>{" "}
                        <CCardText
                          style={{ marginBottom: "-1%", marginTop: "1.5%" }}
                        >
                          <CCardText
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("view", item.video_id)}
                          >{`${item.views} Visualizações • ${diffDate(
                            state.today,
                            item.created_at
                          )}`}</CCardText>{" "}
                        </CCardText>
                      </CCardBody>
                    </div>
                  </CCard>
                </CCol>
              ))}
            </>
          )}
        </CRow>
      </CContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(ChannelVideos));
