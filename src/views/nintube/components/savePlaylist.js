//REACT
import React, { useState, useEffect, useCallback } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import {
  CCol,
  CFormGroup,
  CLabel,
  CInputCheckbox,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCardFooter,
  CInput,
} from "@coreui/react";
//Componets
import CIcon from "@coreui/icons-react";
//Style
//API
import { confirmAlert } from "react-confirm-alert"; // Import
import { alert } from "../../../util/alertApi";
import {
  API_URL,
  getPlaylistWithVideoId,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  createPlaylist,
} from "../../../util/Api";
//import { isInteger } from "core-js/core/number";

const SavePlaylist = ({ user, video_id, kill }) => {
  const [state, setState] = useState({
    playlists: [],
  });

  const [nPlaylist, setNPlaylist] = useState({
    name: "",
    public_bool: true,
    closed: true,
  });

  const playlistsPopup = () => {
    if (user) {
      confirmAlert({
        title: "Playlists",
        afterClose: kill,
        customUI: ({ onClose }) => {
          var text,
            option = [];
          return (
            <CCard style={{ backgroundColor: "lightgrey" }}>
              <CCardBody>
                <div className="custom-ui">
                  <CFormGroup row>
                    <CCol>
                      <p>
                        <strong>Salvar em...</strong>
                      </p>

                      {state.playlists.map((playlist, index) => (
                        <CFormGroup key={index} variant="checkbox">
                          <CRow>
                            <CCol sm="10">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id={playlist.id}
                                checked={playlist.inside}
                                name={index}
                                onChange={(e) => {
                                  playlistClick(e.target.name);
                                }}
                              ></input>
                              <CLabel
                                style={{ color: "black", paddingLeft: "5px" }}
                                htmlFor="radio1"
                              >
                                {playlist.name}
                              </CLabel>
                            </CCol>
                            <CCol sm="1">
                              {playlist.public ? (
                                <CIcon name="cil-globe-alt" />
                              ) : (
                                <CIcon name="cil-lock-locked" />
                              )}
                            </CCol>
                          </CRow>
                        </CFormGroup>
                      ))}
                    </CCol>
                  </CFormGroup>
                </div>
              </CCardBody>
              <CCardFooter style={{ backgroundColor: "lightgrey" }}>
                {nPlaylist.closed ? (
                  <CButton
                    onClick={() => {
                      setNPlaylist({ ...nPlaylist, closed: false });
                    }}
                  >
                    <CIcon name="cil-plus" />
                    <CLabel style={{ color: "black" }}> Nova Playlist</CLabel>
                  </CButton>
                ) : (
                  <CFormGroup row>
                    <CCol sm="1">
                      {nPlaylist.public_bool ? (
                        <CIcon
                          name="cil-globe-alt"
                          style={{ height: "100%" }}
                          onClick={() => {
                            setNPlaylist({ ...nPlaylist, public_bool: false });
                          }}
                        />
                      ) : (
                        <CIcon
                          name="cil-lock-locked"
                          style={{ height: "100%" }}
                          onClick={() => {
                            setNPlaylist({ ...nPlaylist, public_bool: true });
                          }}
                        />
                      )}
                    </CCol>
                    <CCol>
                      <CInput
                        onChange={(e) => {
                          setNPlaylist({ ...nPlaylist, name: e.target.value });
                        }}
                      ></CInput>
                    </CCol>
                    <CCol sm="3">
                      <CButton
                        onClick={playlistCreate}
                        class="btn btn-outline-dark"
                      >
                        Criar
                      </CButton>
                    </CCol>
                  </CFormGroup>
                )}
              </CCardFooter>
            </CCard>
          );
        },
      });
    }
  };
  const playlistClick = async (index) => {
    let playlists = JSON.parse(JSON.stringify(state.playlists));
    // for(let i =0; i < playlists.length; i++){

    // }
    playlists[index].inside = !playlists[index].inside;
    var response;
    if (playlists[index].inside) {
      response = await addToPlaylist(playlists[index].id);
    } else {
      response = await removeFromPlaylist(playlists[index].id);
    }
    if (response) {
      setState({ ...state, playlists });
    }
  };

  const playlistCreate = async () => {
    if (
      nPlaylist.name !== null &&
      nPlaylist.name !== "Vídeos curtidos" &&
      nPlaylist.name.trim() !== ""
    ) {
      var response = await reqCreatePlaylist();
      if (response.status) {
        let playlists = JSON.parse(JSON.stringify(state.playlists));
        playlists.push({
          id: response.id,
          name: nPlaylist.name,
          public: nPlaylist.public_bool,
          inside: true,
        });
        setState({ ...state, playlists });
        setNPlaylist({ name: "", public_bool: true, closed: true });
      }
    }
  };

  const reqCreatePlaylist = async () => {
    var data = {
      token: user.token,
      name: nPlaylist.name,
      is_public: nPlaylist.public_bool,
      video_id: video_id,
    };
    return await createPlaylist(data);
  };

  const addToPlaylist = async (playlist_id) => {
    var data = { token: user.token, video_id, playlist_id };
    return await addVideoToPlaylist(data);
  };

  const removeFromPlaylist = async (playlist_id) => {
    var data = { token: user.token, video_id, playlist_id };
    return await removeVideoFromPlaylist(data);
  };

  const getPlaylists = async () => {
    var data = { token: user.token, video_id: video_id };
    const dt = await getPlaylistWithVideoId(data);

    var playlists = [];
    for (let i = 0; i < dt[0].length; i++) {
      var playlist = {
        id: dt[0][i].id,
        name: dt[0][i].name,
        public: dt[0][i].public,
        inside: dt[1].includes(dt[0][i].id),
      };
      playlists.push(playlist);
    }

    setState({ ...state, playlists });
  };

  useEffect(() => {
    getPlaylists();
  }, []);

  useEffect(() => {
    playlistsPopup();
  }, [state.playlists, nPlaylist]);

  return <div />;
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(SavePlaylist);
