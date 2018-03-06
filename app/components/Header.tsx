import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import * as logo from "../../app/assets/img/logo_yellow.svg";
import { actions } from "../modules/actions";
import { selectIsAuthorized } from "../modules/auth/reducer";
import { appConnect } from "../store";
import { appRoutes } from "./AppRouter";
import * as styles from "./Header.module.scss";
import { ButtonSecondary } from "./shared/Buttons";

interface IStateProps {
  isAuthorized: boolean;
}

interface IDispatchProps {
  logout: () => void;
}

export const HeaderComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Navbar dark className="bg-dark">
    <Link to={appRoutes.root} className="navbar-brand">
      <img src={logo} className={styles.logo} />
    </Link>
    {props.isAuthorized && (
      <ButtonSecondary className="text-white" onClick={props.logout} data-test-id="Header-logout">
        LOGOUT
      </ButtonSecondary>
    )}
  </Navbar>
);

export const Header = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
  }),
  dispatchToProps: dispatch => ({
    logout: () => {
      dispatch(actions.auth.logout());
    },
  }),
})(HeaderComponent);
