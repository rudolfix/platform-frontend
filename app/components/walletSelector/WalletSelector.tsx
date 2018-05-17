import * as React from "react";
import { Col, Row } from "reactstrap";

import { compact } from "lodash";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { actions } from "../../modules/actions";
import {
  selectIsLoginRoute,
  selectLocation,
  selectOppositeRootPath,
  selectRootPath,
  selectUrlUserType,
} from "../../modules/wallet-selector/selectors";
import { appConnect } from "../../store";
import { IIntlProps, injectIntlHelpers } from "../../utils/injectIntlHelpers";
import { onEnterAction } from "../../utils/OnEnterAction";
import { appRoutes } from "../appRoutes";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { InfoBlock } from "../shared/InfoBlock";
import { Tabs } from "../shared/Tabs";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";

interface IStateProps {
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
  location: any;
}

export const WalletSelectorComponent: React.SFC<IStateProps & IIntlProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
  intl: { formatIntlMessage },
  location,
  ...props
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
                (userType === "investor" ||
                  process.env.NF_ISSUERS_CAN_LOGIN_WITH_NEUFUND_WALLET === "1") && {
                  path: `${rootPath}/light`,
                  text: isLoginRoute
                    ? formatIntlMessage("wallet-selector.tabs.neuwallet-login")
                    : formatIntlMessage("wallet-selector.tabs.neuwallet-register"),
                  dataTestId: "wallet-selector-light",
                },
                userType === "investor" && {
                  path: `${rootPath}/browser`,
                  text: isLoginRoute
                    ? formatIntlMessage("wallet-selector.tabs.browser-wallet-login")
                    : formatIntlMessage("wallet-selector.tabs.browser-wallet-register"),

                  dataTestId: "wallet-selector-browser",
                },
                {
                  path: `${rootPath}/ledger`,
                  text: isLoginRoute
                    ? formatIntlMessage("wallet-selector.tabs.ledger-login")
                    : formatIntlMessage("wallet-selector.tabs.ledger-register"),
                  dataTestId: "wallet-selector-ledger",
                },
              ])}
            />
          </Row>
          {
            location.pathname === `${rootPath}/light`
              && (
                <Row>
                <Col xs={12} md={{size: 8, offset: 2}}>
                <InfoBlock>
                  <FormattedMessage id="wallet-selector.light.icbm-info.message"/>{" "}
                  <Link to="/"><FormattedMessage id="wallet-selector.light.icbm-info.read-more-here"/></Link>
                </InfoBlock>
                </Col>
              </Row>
              )
          }
          <Row>
            <Col>
              <WalletRouter rootPath={rootPath} />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col xs={12} sm={6}>
              <span>
                {isLoginRoute ? (
                  <>
                    <FormattedMessage id="wallet-selector.login.help-link" />{" "}
                    <Link to={appRoutes.recover}>
                      <FormattedMessage id="wallet-selector.help-link.label" />
                    </Link>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="wallet-selector.register.help-link" />{" "}
                    <a href="https://neufund.freshdesk.com/support/home">
                      <FormattedMessage id="wallet-selector.help-link.label" />
                    </a>
                  </>
                )}
              </span>
            </Col>
            <Col xs={12} sm={6}>
              <span className="float-sm-right">
                {oppositeViewLabel}{" "}
                <Link to={oppositeRoute} data-test-id="wallet-selector-opposite-route-link">
                  {oppositeViewLinkLabel}
                </Link>
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
      location: selectLocation(s.router)
    }),
  }),
  injectIntlHelpers,
)(WalletSelectorComponent);
