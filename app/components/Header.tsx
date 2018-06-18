import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import * as logo from "../../app/assets/img/logo_yellow.svg";
import { actions } from "../modules/actions";
import { selectIsAuthorized } from "../modules/auth/selectors";
import { appConnect } from "../store";
import { appRoutes } from "./appRoutes";
import * as styles from "./Header.module.scss";
import { Button } from "./shared/Buttons";
import { loginWalletRoutes, walletRegisterRoutes } from "./walletSelector/walletRoutes";

interface IStateProps {
  isAuthorized: boolean;
  location: any;
}

interface IDispatchProps {
  logout: () => void;
}

export const HeaderComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Navbar dark className={styles.bar}>
    <Link to={appRoutes.root} className="navbar-brand">
      <img src={logo} className={styles.logo} /> <span className={styles.logoText}>NEUFUND</span>
    </Link>
    {props.isAuthorized ? (
      <Button layout="secondary" theme="white" onClick={props.logout} data-test-id="Header-logout">
        LOGOUT
      </Button>
    ) : (
      <div className={styles.buttons}>
        {props.location && props.location.indexOf("eto") !== -1 ? (
          <>
            <Link data-test-id="Header-register-eto" to={appRoutes.registerEto}>
              <Button theme="white">REGISTER</Button>
            </Link>
            <Link data-test-id="Header-login-eto" to={appRoutes.loginEto}>
              <Button theme="white">LOGIN</Button>
            </Link>
          </>
        ) : (
          <>
            <Link data-test-id="Header-register" to={walletRegisterRoutes.light}>
              <Button theme="white">REGISTER</Button>
            </Link>
            <Link data-test-id="Header-login" to={loginWalletRoutes.light}>
              <Button theme="white">LOGIN</Button>
            </Link>
          </>
        )}
      </div>
    )}
  </Navbar>
);

export const Header = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    location: s.router.location && s.router.location.pathname,
  }),
  dispatchToProps: dispatch => ({
    logout: () => {
      dispatch(actions.auth.logout());
    },
  }),
})(HeaderComponent);
