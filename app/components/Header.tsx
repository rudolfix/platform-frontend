import * as React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import { TUserType } from "../lib/api/users/interfaces";
import { actions } from "../modules/actions";
import { selectIsAuthorized, selectUserType } from "../modules/auth/selectors";
import { appConnect } from "../store";
import { appRoutes } from "./appRoutes";
import { Button, ButtonLink } from "./shared/buttons";
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
            <ButtonLink
              theme="white"
              className={styles.registerButton}
              data-test-id="Header-register-eto"
              to={appRoutes.registerEto}
            >
              REGISTER
            </ButtonLink>
            <ButtonLink theme="white" data-test-id="Header-login-eto" to={appRoutes.loginEto}>
              LOGIN
            </ButtonLink>
          </>
        ) : (
          <>
            <ButtonLink
              theme="white"
              className={styles.registerButton}
              data-test-id="Header-register"
              to={walletRegisterRoutes.light}
            >
              REGISTER
            </ButtonLink>
            <ButtonLink theme="white" data-test-id="Header-login" to={loginWalletRoutes.light}>
              LOGIN
            </ButtonLink>
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
