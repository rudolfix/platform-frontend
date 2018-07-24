import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import { TUserType } from "../lib/api/users/interfaces";
import { actions } from "../modules/actions";
import { selectIsAuthorized, selectUserType } from "../modules/auth/selectors";
import { appConnect } from "../store";
import { appRoutes } from "./appRoutes";
import { Button } from "./shared/Buttons";
import { loginWalletRoutes, walletRegisterRoutes } from "./walletSelector/walletRoutes";

import * as logo from "../../app/assets/img/logo_yellow.svg";
import * as logoText from "../../app/assets/img/neufund-logo.svg";
import * as styles from "./Header.module.scss";

interface IStateProps {
  isAuthorized: boolean;
  userType: TUserType;
  location: any;
}

interface IDispatchProps {
  logout: (userType: TUserType) => void;
}

export const HeaderComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Navbar dark className={styles.bar}>
    <Link to={appRoutes.root} className={styles.logo}>
      <img src={logo} className={styles.logoImage} />
      <img src={logoText} alt="NEUFUND" className={styles.logoText} />
    </Link>
    {props.isAuthorized ? (
      <Button
        layout="secondary"
        theme="white"
        onClick={() => props.logout(props.userType)}
        data-test-id="Header-logout"
      >
        LOGOUT
      </Button>
    ) : (
      <div className={styles.buttons}>
        {props.location && props.location.indexOf("eto") !== -1 ? (
          <>
            <span>
              <Link
                data-test-id="Header-register-eto"
                className={styles.registerButton}
                to={appRoutes.registerEto}
              >
                <Button theme="white">REGISTER</Button>
              </Link>
            </span>
            <Link data-test-id="Header-login-eto" to={appRoutes.loginEto}>
              <Button theme="white">LOGIN</Button>
            </Link>
          </>
        ) : (
          <>
            <Link
              data-test-id="Header-register"
              className={styles.registerButton}
              to={walletRegisterRoutes.light}
            >
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
    userType: selectUserType(s.auth)!,
    location: s.router.location && s.router.location.pathname,
  }),
  dispatchToProps: dispatch => ({
    logout: (userType: TUserType) => {
      dispatch(actions.auth.logout(userType));
    },
  }),
})(HeaderComponent);
