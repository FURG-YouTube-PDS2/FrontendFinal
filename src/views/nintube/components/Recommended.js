//REACT
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
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
//Componets
//Style
import "./componentStyle.css";
//API
import { getRecs, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";

const Recommended = ({ user, video_id }) => {
  let { id } = useParams();
  const [state, setState] = useState({
    videos: [],
    fetched: false,
  });
  let history = useHistory();
  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
    window.location.reload();
  };
  useEffect(() => {
    if (!state.fetched) {
      var data = {
        video_id: id,
      };
      getRecs(data)
        .then(function (data) {
          setState({ ...state, fetched: true, videos: data });
          video_id(data[0].id);
        })
        .catch((err) => {
          setState({ ...state, fetched: true });
          alert(
            "Houve um problema nos recomendados",
            "Deseja Recarregar a pagina",
            [
              {
                label: "Sim",
                onClick: () => {
                  window.location.reload();
                },
              },
              {
                label: "Não",
              },
            ]
          );
        });
    }
  }, []);
  return (
    <>
      {!state.fetched && (
        <div style={{ display: "flex", height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      <div>
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
                  <div style={{ height: "100%" }}>
                    <CImg
                      onClick={() => handleClick("view", item.id)}
                      style={{
                        height: "80px",
                        width: "22%",
                        cursor: "pointer",
                        float: "left",
                        marginRight: "1%",
                        borderBottom: "1px solid black",
                        borderRadius: "10px",
                      }}
                      src={API_URL + "images/getImage/" + item.id}
                    />
                  </div>
                  <CCardText>
                    <CCardText>
                      <h5
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("view", item.id)}
                      >
                        {item.title.length <= 53
                          ? item.title
                          : item.title.substring(0, 50) + "..."}
                      </h5>
                      <div
                        style={{ cursor: "pointer", marginBottom: "1%" }}
                        onClick={() => handleClick("channel", item.channel_id)}
                      >
                        {item.channel}
                      </div>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handleClick("view", item.id)}
                      >
                        {` • ${item.views} Visualizações •
                       ${diffDate(new Date(), item.date)}`}
                      </span>{" "}
                    </CCardText>
                  </CCardText>
                </CCardBody>
              </CCard>
            ))}
          </CCol>
        </CRow>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommended));
