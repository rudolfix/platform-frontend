import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { WarningAlert } from "../../shared/WarningAlert";
import arrowIcon from "../../../assets/img/inline_icons/link_arrow.svg";
import logoChrome from "../../../assets/img/wallet_selector/logo_chrome.svg";
import * as styles from "./WalletLedgerNotSupportedComponent.module.scss";

interface IBrowserCard {
  name: string;
  img: string;
  url: string;
}

const BrowserCard: React.FunctionComponent<IBrowserCard> = ({ name, img, url }) => (
  <div>
    <h4 className={styles.browserCardTitle}>{name}</h4>
    <img className={cn("my-2 my-md-4", styles.browserCardImg)} src={img} />
    <a href={url} className={styles.browserCardLink}>
      Download <img src={arrowIcon} />
    </a>
  </div>
);

export const WalletLedgerNotSupported: React.FunctionComponent = () => (
  <>
    <WarningAlert className="my-5">
      <FormattedMessage id="wallet-selector.ledger-not-supported" />
    </WarningAlert>
    <BrowserCard name="Chrome" img={logoChrome} url="https://www.google.pl/chrome/" />
  </>
);
