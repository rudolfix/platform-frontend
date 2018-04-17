import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { WarningAlert } from "../shared/WarningAlert";

import * as logoChrome from "../../assets/img/wallet_selector/logo_chrome.svg";
import * as logoFirefox from "../../assets/img/wallet_selector/logo_firefox.svg";
import * as styles from "./WalletLedgerNotSupportedComponent.module.scss";

import * as arrowIcon from "../../assets/img/link_arrow.svg";
import { appConnect } from "../../store";
import { selectIsLoginRoute } from "../../modules/wallet-selector/selectors";

interface IBrowserCard {
  name: string;
  img: string;
  url: string;
}

const BrowserCard: React.SFC<IBrowserCard> = ({ name, img, url }) => (
  <Col xs="12" sm="4" className={cn("mb-4 mb-md-0 px-4")}>
    <h4 className={styles.browserCardTitle}>{name}</h4>
    <img className={cn("my-2 my-md-4", styles.browserCardImg)} src={img} />
    <a href={url} className={styles.browserCardLink}>
      Download <img src={arrowIcon} />
    </a>
  </Col>
);

interface IStateProps {
  isLoginRoute: boolean;
}

export const WalletLedgerNotSupportedComponent: React.SFC<IStateProps> = ({ isLoginRoute }) => (
  <>
    <Row>
      <Col>
        <h1 className="text-center">
          {isLoginRoute ? "Log in with Nano Ledger" : "Register your Nano Ledger"}
        </h1>
      </Col>
    </Row>
    <Row className="justify-content-center">
      <WarningAlert className="my-5">
        Your browser does not support NeuKey. For security reasons we require a recent version of:
      </WarningAlert>
    </Row>
    <Row className="justify-content-center text-center">
      <BrowserCard name="Chrome" img={logoChrome} url="https://www.google.pl/chrome/" />
      <BrowserCard name="Firefox" img={logoFirefox} url="https://www.mozilla.org/pl/firefox/new/" />
    </Row>
  </>
);

export const WalletLedgerNotSupported = appConnect({
  stateToProps: s => ({
    isLoginRoute: selectIsLoginRoute(s.router),
  }),
})(WalletLedgerNotSupportedComponent);
