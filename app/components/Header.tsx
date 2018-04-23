import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import * as logo from "../../app/assets/img/logo_yellow.svg";
import { actions } from "../modules/actions";
import { selectIsAuthorized } from "../modules/auth/selectors";
import { appConnect } from "../store";
import { appRoutes } from "./AppRouter";
import * as styles from "./Header.module.scss";
import { Button } from "./shared/Buttons";
import { loginWalletRoutes } from "./walletSelector/walletRoutes";

interface IProps {
  loginLink?: string;
}

interface IStateProps {
  isAuthorized: boolean;
}

interface IDispatchProps {
  logout: () => void;
}

export const HeaderComponent: React.SFC<IStateProps & IDispatchProps & IProps> = props => (
  <Navbar dark className={styles.bar}>
    <Link to={appRoutes.root} className="navbar-brand">
      <img src={logo} className={styles.logo} />
    </Link>
    {props.isAuthorized ? (
      <Button
        layout="secondary"
        theme="t-white"
        onClick={props.logout}
        data-test-id="Header-logout"
      >
        LOGOUT
      </Button>
    ) : (
      <Link
        to={
          location.pathname === appRoutes.etoLanding ? appRoutes.loginEto : loginWalletRoutes.light
        }
      >
        <Button theme="t-white" data-test-id="Header-login">
          LOGIN
        </Button>
      </Link>
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
