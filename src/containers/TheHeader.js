//REACT
import React, { useState, useEffect} from "react";
import { useHistory, useLocation} from "react-router-dom";
//REDUX
import { connect, useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../store/actions/index";
//CoreUI
import {
  CHeader,
  CToggler,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CFormGroup,
  CLabel,
  CInputCheckbox,
  CForm,
  CDropdownDivider,
  CDropdownItem,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CInputGroup,
  CInputGroupAppend,
  CInputGroupText,
  CInput,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CButton,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
//API
import { alert } from "../util/alertApi";
import { loginUser } from "../util/Api";
import md5 from "md5";

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks,
} from "./index";

const TheHeader = ({ user, setuser }) => {
  const [state, setState] = useState({
    error: "",
    message: "",
    email: "",
    password: "",
    search: "",
  });
  const [searchBar, setSearchBar] = useState(true);
  let location = useLocation();
  let history = useHistory();
  const login = (e) => {
    e.preventDefault();
    setState({ ...state, error: "", message: "Logando..." });
    var data = {
      email: state.email,
      password: md5(state.password),
    };
    // const data = {
    //   email: "davi@furg.br",
    //   password: "senha",
    // };
    if (!data.email || !data.password) {
      setState({
        ...state,
        error: "Insira os dados corretamente!",
        message: "",
      });
    } else {
      loginUser(data)
        .then(function (data) {
          var user = {
            token: data.token,
            avatar: "",
          };
          setuser(user);
          history.push("/home");
        })
        .catch((err) => {
          setState({ ...state, error: "Dados inválidos", message: "" });
        });
    }
  };

  const forgotPassword = () => {
    history.push("/send_email");
  };
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const logged = user ? true : false;

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow)
      ? false
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow)
      ? true
      : "responsive";
    dispatch({ type: "set", sidebarShow: val });
  };

  const dark = "dark";

  const handleKeys = (e) => {
    if (e.keyCode === 13) {
      doSearch();
    }
  };
  const doSearch = () => {
    history.push("/search/"+state.search)
  }

  useEffect(() => {
    setSearchBar(location.pathname.split("/")[1] !== "search")
  },[location])

  return (
    <CHeader class={dark + "-mode"} withSubheader>
      {/* <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      /> */}
      {/* <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CImg
          style={{ width: "50%", height: "100%" }}
          className="c-sidebar-brand-full"
          src="https://cdn.discordapp.com/attachments/300483456440336385/790994274631155733/banner_4.png"
        />
      </CHeaderBrand> */}

      {/*<CHeaderNav className="d-md-down-none mr-auto">
         <CIcon name="cib-youtube" /> */}
      {/* <CHeaderNavItem className="px-3"> */}
      {/*<CHeaderNavLink to="/login">Login</CHeaderNavLink>
         </CHeaderNavItem> 
      </CHeaderNav>*/}
      <CHeaderNav
        style={{ width: "50%", marginLeft: "auto" }}
        className="d-md-down-none mr-auto"
      >
        {searchBar &&
        <CInputGroup style={{ border: "1px solid red", borderRadius: "5px" }}>
          <CInput placeholder="Pesquisar" onKeyUp={handleKeys} onChange={(e)=>{setState({...state, search:e.target.value})}}/>
          <CInputGroupAppend>
            <CInputGroupText>
              <CIcon name="cil-magnifying-glass" onClick={doSearch}/>
            </CInputGroupText>
          </CInputGroupAppend>
        </CInputGroup>
        }
      </CHeaderNav>
      {/* {!logged && (
        <div style={{ marginRight: "5%" }}>
          <CDropdown className="m-1">
            <CDropdownToggle color="info">Login</CDropdownToggle>
            <CDropdownMenu>
              <CForm className="px-4 py-3">
                <CFormGroup>
                  <CInput
                    type="text"
                    placeholder="Email"
                    onChange={(e) => {
                      state.email = e.target.value;
                    }}
                  />
                </CFormGroup>
                <CFormGroup>
                  <CInput
                    type="password"
                    placeholder="Senha"
                    onChange={(e) => {
                      state.password = e.target.value;
                    }}
                  />
                </CFormGroup>
                {/* <CFormGroup variant="custom-checkbox" className="form-group">
                  <CInputCheckbox custom id="exampleDropdownFormCheckbox1" />
                  <CLabel
                    variant="custom-checkbox"
                    htmlFor="exampleDropdownFormCheckbox1"
                  >
                    Remember me
                  </CLabel>
                </CFormGroup> */}
      {/*<CFormGroup className="mt-2">
                  <CButton color="primary" onClick={(e) => login(e)}>
                    Login
                  </CButton>
                </CFormGroup>
              </CForm>
              <CDropdownDivider />
              <CDropdownItem to="/register">Register</CDropdownItem>
              <CDropdownItem onClick={() => forgotPassword()}>
                Forgot password?
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </div> */}
      {/* // <CButton
        //   className="px-3"
        //   style={{
        //     marginRight: "2%",
        //     color: "white",
        //     border: "1px solid red",
        //     borderRadius: "30px",
        //   }}
        // >
        //   Login
        // </CButton>
      // )} */}
      {logged ? (
        <>
          <CHeaderNav className="px-3">
            <TheHeaderDropdownNotif />
            {/* <TheHeaderDropdownTasks /> */}
            {/* <TheHeaderDropdownMssg /> */}
            <TheHeaderDropdown />
          </CHeaderNav>
        </>
      ) : (
        <CHeaderNav style={{ width: "10%" }}>
          <CButton
            style={{
              color: "white",
              border: "1px solid white",
              borderRadius: "12px",
              width: "60%",
              height: "60%",
              font: "18px Roboto, Arial, sans-serif",
            }}
            onClick={() => history.push("/login")}
          >
            Login
          </CButton>
        </CHeaderNav>
      )}
      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
        <div className="d-md-down-none mfe-2 c-subheader-nav">
          <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-speech" alt="Settings" />
          </CLink>
          <CLink
            className="c-subheader-nav-link"
            aria-current="page"
            to="/dashboard"
          >
            <CIcon name="cil-graph" alt="Dashboard" />
            &nbsp;Dashboard
          </CLink>
          <CLink className="c-subheader-nav-link" href="#">
            <CIcon name="cil-settings" alt="Settings" />
            &nbsp;Settings
          </CLink>
        </div>
      </CSubheader> */}
    </CHeader>
  );
};

const mapStateToProps = (state) => ({ user: state.user });
const mapDispatchToProps = (dispatch) => bindActionCreators(actions, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(TheHeader);
