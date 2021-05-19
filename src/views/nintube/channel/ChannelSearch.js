//REACT
import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

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
  CInput,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//Componets
import NoVideo from "../components/noVideo";
//Style
import "../styles/nintube.css";
import "../components/componentStyle.css";
//API
import { SearchInChannel, Inscribe, API_URL } from "../../../util/Api";
import { diffDate } from "../../../util/dateDiff";

const ChannelSearch = ({ user, search, channel_id }) => {
  const [state, setState] = useState({
    searchText: search,
    channel_id: channel_id,
    videos: [],
  });
  let history = useHistory();
  const handleClick = (route, id) => {
    history.push("/" + route + "/" + id);
  };

  const handleKeys = (e) => {
    if (e.keyCode === 13) {
      doSearch();
    }
  };

  const doSearch = () => {
    var data = {
      input: state.searchText,
      channel_id: state.channel_id !== "0" ? state.channel_id : "",
      token: user !== null && user !== "" ? user.token : "",
    };

    // data = searchSimulator()
    // setState({ ...state, fetched: true, videos:data.videos});
    SearchInChannel(data).then(function (data) {
      // console.log(data);
      setState({ ...state, fetched: true, videos: data.videos });
    });
  };

  useEffect(() => {
    doSearch();
  }, []);
  // console.log(state.videos);
  return (
    <div>
      <center>
        <CInputGroup
          style={{ border: "1px solid red", borderRadius: "5px", width: "50%" }}
        >
          <CInput
            placeholder="Pesquisar"
            onKeyUp={handleKeys}
            value={state.searchText}
            onChange={(e) => {
              setState({ ...state, searchText: e.target.value });
            }}
          />
          <CInputGroupAppend>
            <CInputGroupText>
              <CIcon name="cil-magnifying-glass" onClick={doSearch} />
            </CInputGroupText>
          </CInputGroupAppend>
        </CInputGroup>
      </center>
      <br />
      {!state.fetched && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      <CContainer fluid>
        <CRow>
          <>
            {state.videos.length === 0 ? (
              <div style={{ width: "100%", height: "100%" }}>
                <NoVideo />
              </div>
            ) : (
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
                          height: "150px",
                          width: "15%",
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
                            {item.title.length <= 103
                              ? item.title
                              : item.title.substring(0, 100) + "..."}
                          </h5>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleClick("view", item.id)}
                          >
                            {` • ${item.views}  Visualizações • ${diffDate(
                              state.today,
                              item.created_at
                            )}`}
                          </span>{" "}
                        </CCardText>
                        <CCardText
                          style={{ cursor: "pointer" }}
                          onClick={() => handleClick("view", item.id)}
                        >
                          <div className="float-left">
                            {item.description.length <= 63
                              ? item.description
                              : item.description.substring(0, 60) + "..."}
                          </div>
                        </CCardText>{" "}
                      </CCardText>
                    </CCardBody>
                  </CCard>
                ))}
              </CCol>
            )}
          </>
        </CRow>
      </CContainer>
      {state.fetched && state.videos.legth === 0 && <NoVideo />}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(ChannelSearch);
