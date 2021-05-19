//REACT
import React, { useEffect, useState } from "react";
//REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../store/actions";
//CoreUI
import { CButton } from "@coreui/react";
//Componets
import LibraryPlaylists from "../components/libraryPlaylists";
import LogoutPage from "../components/logoutPage";
//Style
//API

const Library = ({ history, user }) => {
  const [state, setState] = useState({
    fetched: false,
  });
  const handleClick = () => {
    history.push("/playlist");
  };
  useEffect(() => {
    if (!state.fetched) {
      setState({ ...state, fetched: true });
    }
  }, []);
  return (
    <div>
      {user !== null && user !== "" ? (
        <>
          <LibraryPlaylists />
          {/* <h4>Histórico</h4>
          <ShowVideos />
          <h4>Assistir mais tarde</h4>
          <ShowVideos />
          <h4>Playlists</h4>
          <AllPlaylists />
          <h4>Vídeos marcados com "gostei"</h4>
          <ShowVideos /> */}
        </>
      ) : (
        <LogoutPage />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Library);
