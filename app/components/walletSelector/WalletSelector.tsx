import * as React from "react";
import { Col, Row } from "reactstrap";

import { compact } from "lodash";
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

export const WalletSelectorComponent: React.SFC<IStateProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
  oppositeRoute,
  userType,
}) => {
  const oppositeViewLabel = isLoginRoute ? "You don't have an account?" : "Do you have an account?";
  const oppositeViewLinkLabel = isLoginRoute ? "Register" : "Login";

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
                  text: "use Neufund wallet",
                  dataTestId: "wallet-selector-light",
                },
                userType === "investor" && {
                  path: `${rootPath}/browser`,
                  text: "use existing wallet",
                  dataTestId: "wallet-selector-browser",
                },
                userType === "investor" && {
                  path: `${rootPath}/ledger`,
                  text: "use nano ledger",
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
                Having troubles with login? <Link to={appRoutes.recover}>Help</Link>
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
)(WalletSelectorComponent);
