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
import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartRadar,
  CChartPie,
  CChartPolarArea,
} from "@coreui/react-chartjs";
//API
import { getChartValues } from "../../../util/Api";
import { alert } from "../../../util/alertApi";
//Style
import "../components/componentStyle.css";

var back_data = {
  gender: { data: [], labels: ["Feminino", "Masculino", "Outros"] },
  age: {
    data: [],
    labels: ["-10", "10-13", "14-16", "17-19", "19-24", "24+"],
  },
  channels: {
    data: [],
    labels: [],
  },
};

const Statistics = ({ user, history }) => {
  const [state, setState] = useState({
    data: ["0"],
    gender: [],
    age: [],
    channels: [],
    fetched: false,
  });
  useEffect(() => {
    if (!state.fetched) {
      if (user === null || user === "") {
        alert(
          "Houve um problema",
          "Você não está logado para realizar essa ação por favor realize o login.",
          [
            {
              label: "Cancelar",
              onClick: () => {
                history.push("/home");
              },
            },
            {
              label: "Login",
              onClick: () => {
                history.push("/login");
              },
            },
          ]
        );
      } else {
        var data = {
          token: user.token,
        };
        getChartValues(data)
          .then(function (data) {
            // setState({})
            var channel_names = [];
            data.channels.name.map((channel) =>
              channel_names.push(channel.username)
            );
            var age = {
              data: data.age,
              labels: ["-10", "10-13", "14-16", "17-19", "19-24", "24+"],
            };
            var gender = {
              data: data.gender,
              labels: ["Feminino", "Masculino", "Outros"],
            };
            var channels = {
              data: data.channels.data,
              labels: channel_names,
            };
            setState({
              ...state,
              gender: gender,
              age: age,
              channels: channels,
            });
          })
          .catch((err) => {
            setState({ ...state, error: "Dados inválidos", message: "" });
          });
      }
    }
  }, []);

  return (
    <div>
      {/* {state.gender.length === 0 && (
        <div className="div-reload">
          <CIcon className="icone" name="cilReload" size="3xl" />
        </div>
      )} */}
      {state.gender.length === 0 && (
        <div className="c-app c-default-layout" style={{ height: "100%" }}>
          <div className="div-reload">
            <CIcon className="icone" name="cilReload" size="3xl" />
          </div>
        </div>
      )}
      {state.gender.length !== 0 && (
        <>
          <h3 style={{ color: "white" }}>Estatíscas do Canal</h3>{" "}
          <CRow>
            <CCol sm="6">
              <CCard>
                <CCardHeader> Genero </CCardHeader>
                <CCardBody>
                  <CChartPie
                    type="pie"
                    datasets={[
                      {
                        backgroundColor: [
                          "#41B883",
                          "rgb(255, 230, 59)",
                          // "rgb(58, 151, 255)",
                          "#7F00FF",
                          // "orange",
                        ],
                        data: state.gender.data,
                      },
                    ]}
                    labels={state.gender.labels}
                    options={{
                      tooltips: {
                        enabled: true,
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol sm="6">
              <CCard>
                <CCardHeader> Idade </CCardHeader>
                <CCardBody>
                  <CChartPolarArea
                    type="polarArea"
                    datasets={[
                      {
                        backgroundColor: [
                          "#41B883",
                          "#00D8FF",
                          "#DD1B16",
                          "orange",
                          "purple",
                          "pink",
                        ],
                        data: state.age.data,
                      },
                    ]}
                    labels={state.age.labels}
                    options={{
                      tooltips: {
                        enabled: true,
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CCard>
            <CCardHeader> Canais Relacionados </CCardHeader>
            <CCardBody>
              <CChartBar
                type="bar"
                datasets={[
                  {
                    barPercentage: 0.3,
                    categoryPercentage: 1,
                    backgroundColor:
                      // [
                      // "#41B883",
                      // "#E46651",
                      // "#00D8FF",
                      "#008EAB",
                    // "#DD1B16",
                    // ],
                    data: state.channels.data,
                  },
                ]}
                labels={state.channels.labels}
                options={{
                  tooltips: {
                    enabled: true,
                  },
                  legend: {
                    display: false,
                  },
                  scales: {
                    xAxes: [
                      {
                        offset: true,
                        gridLines: {
                          // color: "transparent",
                          // zeroLineColor: "transparent",
                        },
                        ticks: {
                          fontSize: 15,
                          fontColor: "Black",
                        },
                      },
                    ],
                    yAxes: [
                      {
                        // offset: true,
                        gridLines: {
                          color: "#C1C1C1",
                          // zeroLineColor: "transparent",
                        },
                        ticks: {
                          fontSize: 14,
                          fontColor: "Black",
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Statistics);
