import { EButtonLayout, EButtonSize } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { appRoutes } from "../../appRoutes";
import { ButtonLink } from "../../shared/buttons/ButtonLink";
import { walletLoginRoutes } from "../../wallet-selector/WalletSelectorLogin/wallet-routes";
import { Menu } from "../menus/menu/Menu";
import { MobileMenu } from "../menus/mobileMenu/MobileMenu";
import { MyAccountMenu } from "../menus/MyAccountMenu";
import { PendingTransactionStatus } from "./PendingTransactionStatus";

import logoNew from "../../../assets/img/logo_neufund_on_white.svg";
import logoNewTitle from "../../../assets/img/logo_neufund_on_white_title.svg";
import * as styles from "./Header.module.scss";

const LogoUnauth = () => (
  <Link to={appRoutes.root} className={styles.logoUnauth}>
    <img src={logoNew} alt="NEUFUND" className={styles.logoImage} />
    <img src={logoNewTitle} alt="NEUFUND" className={styles.logoTitle} />
  </Link>
);

const LogoAuth = () => (
  <Link to={appRoutes.root} className={styles.logoAuth}>
    <img src={logoNew} alt="NEUFUND" className={styles.logoImage} />
    <img src={logoNewTitle} alt="NEUFUND" className={styles.logoTitleAuth} />
  </Link>
);

const LogoFullScreen = () => (
  <Link to={appRoutes.root} className={styles.logoUnauth}>
    <img src={logoNew} alt="NEUFUND" className={styles.logoImage} />
    <img src={logoNewTitle} alt="NEUFUND" className={styles.logoTitleFullscreen} />
  </Link>
);

const LoginButton: React.FunctionComponent = () => (
  <ButtonLink
    className={styles.button}
    layout={EButtonLayout.OUTLINE}
    data-test-id="Header-login"
    to={walletLoginRoutes.light}
    size={EButtonSize.DYNAMIC}
  >
    <FormattedMessage id="header.login-button" />
  </ButtonLink>
);

const GetStartedButton: React.FunctionComponent<{ isLoginPage?: boolean }> = ({ isLoginPage }) => (
  <ButtonLink
    className={styles.button}
    layout={EButtonLayout.PRIMARY}
    data-test-id="Header-register"
    to={appRoutes.registerWithLightWallet}
    size={EButtonSize.DYNAMIC}
  >
    {isLoginPage ? (
      <FormattedMessage id="header.sign-up-button" />
    ) : (
      <FormattedMessage id="header.get-started-button" />
    )}
  </ButtonLink>
);

const HeaderUnauthorized: React.FunctionComponent = () => (
  <header className={styles.headerUnauth}>
    <LogoUnauth />
    <LoginButton />
    <GetStartedButton />
  </header>
);

const HeaderTransitional: React.FunctionComponent<{ isLoginRoute: boolean }> = ({
  isLoginRoute,
}) => (
  <header className={styles.headerUnauth}>
    <LogoFullScreen />
    {isLoginRoute ? (
      <>
        <span className={styles.helperText}>
          <FormattedMessage id="header.need-an-account" />
        </span>
        <GetStartedButton isLoginPage={true} />
      </>
    ) : (
      <>
        {" "}
        <span className={styles.helperText}>
          <FormattedMessage id="header.already-have-an-account" />
        </span>
        <LoginButton />
      </>
    )}
  </header>
);

const HeaderAuthorized: React.FunctionComponent = () => (
  <header className={styles.headerAuth}>
    <MobileMenu />
    <LogoAuth />
    <Menu />
    <PendingTransactionStatus className={styles.transactionStatus} />
    <MyAccountMenu />
  </header>
);

export {
  HeaderUnauthorized,
  HeaderAuthorized,
  HeaderTransitional,
  LogoAuth,
  LogoUnauth,
  LogoFullScreen,
};
