import * as React from "react";
import { Col, Row } from "reactstrap";

import { compact } from "lodash";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { actions } from "../../modules/actions";
import {
  selectIsLoginRoute,
  selectOppositeRootPath,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { IIntlProps, injectIntlHelpers } from "../../utils/injectIntlHelpers";
import { onEnterAction } from "../../utils/OnEnterAction";
import { appRoutes } from "../AppRouter";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { Tabs } from "../shared/Tabs";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";

interface IStateProps {
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
}

export const WalletSelectorComponent: React.SFC<IStateProps & IIntlProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
  intl: { formatIntlMessage },
}) => {
  const oppositeViewLabel = isLoginRoute
    ? formatIntlMessage("wallet-selector.neuwallet.register-link-text")
    : formatIntlMessage("wallet-selector.neuwallet.login-link-text");
  const oppositeViewLinkLabel = isLoginRoute
    ? formatIntlMessage("wallet-selector.register")
    : formatIntlMessage("wallet-selector.login");

  return (
    <LayoutRegisterLogin>
      {isMessageSigning ? (
        <WalletMessageSigner rootPath={rootPath} />
      ) : (
        <>
          <Row className="justify-content-center mb-4 mt-4">
            <Tabs
              tabs={compact([
                {
                  path: `${rootPath}/light`,
                  text: formatIntlMessage("wallet-selector.tabs.neuwallet"),
                  dataTestId: "wallet-selector-light",
                },
                userType === "investor" && {
                  path: `${rootPath}/browser`,
                  text: formatIntlMessage("wallet-selector.tabs.browser-wallet"),
                  dataTestId: "wallet-selector-browser",
                },
                userType === "investor" && {
                  path: `${rootPath}/ledger`,
                  text: formatIntlMessage("wallet-selector.tabs.ledger"),
                  dataTestId: "wallet-selector-ledger",
                },
              ])}
            />
          </Row>
          <Row>
            <Col>
              <WalletRouter rootPath={rootPath} />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} sm={6}>
              <span>
                <FormattedMessage id="wallet-selector.help-link" />
                <Link to={appRoutes.recover}>
                  <FormattedMessage id="wallet-selector.help-link.label" />
                </Link>
              </span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="float-sm-right">
                {oppositeViewLabel} <Link to={oppositeRoute}>{oppositeViewLinkLabel}</Link>
              </span>
            </Col>
          </Row>
        </>
      )}
    </LayoutRegisterLogin>
  );
};

export const WalletSelector = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.walletSelector.reset()),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
      rootPath: selectRootPath(s.router),
      isLoginRoute: selectIsLoginRoute(s.router),
      userType: selectUrlUserType(s.router),
      oppositeRoute: selectOppositeRootPath(s.router),
    }),
  }),
  injectIntlHelpers,
)(WalletSelectorComponent);
