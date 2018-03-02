import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Col } from "reactstrap";

import * as styles from "./WalletSelector.module.scss";

interface IProps {
  rootPath: string;
}

export const WalletSelectorNavigation: React.SFC<IProps> = ({ rootPath }) => (
  <Col
    className={cn(
      "d-flex flex-column flex-md-row justify-content-center mt-3 mb-5",
      styles.walletChooser,
    )}
  >
    <NavLink
      className={cn("mb-3 mb-md-0", styles.wallet)}
      to={`${rootPath}/light`}
      data-test-id="wallet-selector-light"
      data-text="use Neufund wallet"
    >
      <span>use Neufund wallet</span>
    </NavLink>
    <NavLink
      className={cn("mb-3 mb-md-0", styles.wallet)}
      to={`${rootPath}/browser`}
      data-test-id="wallet-selector-browser"
      data-text="use existing wallet"
    >
      <span>use existing wallet</span>
    </NavLink>
    <NavLink
      className={cn("mb-3 mb-md-0", styles.wallet)}
      to={`${rootPath}/ledger`}
      data-test-id="wallet-selector-ledger"
      data-text="use nano ledger"
    >
      <span>use nano ledger</span>
    </NavLink>
  </Col>
);
