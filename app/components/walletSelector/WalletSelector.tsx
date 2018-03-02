import * as React from "react";
import { Col, Row } from "reactstrap";

import { Link } from "react-router-dom";
import { compose } from "redux";
import { actions } from "../../modules/actions";
import { isLoginRoute } from "../../modules/routing/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { appRoutes } from "../AppRouter";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";
import { WalletSelectorNavigation } from "./WalletSelectorNavigation";

interface IStateProps {
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
}

export const WalletSelectorComponent: React.SFC<IStateProps> = ({
  isMessageSigning,
  rootPath,
  isLoginRoute,
}) => {
  const oppositeViewLabel = isLoginRoute ? "You don't have an account?" : "Do you have an account?";
  const oppositeViewLinkLabel = isLoginRoute ? "Register" : "Login";
  const oppositeRoute = isLoginRoute ? appRoutes.register : appRoutes.login;

  return (
    <LayoutRegisterLogin>
      {isMessageSigning ? (
        <WalletMessageSigner rootPath={rootPath} />
      ) : (
        <>
          <Row>
            <WalletSelectorNavigation rootPath={rootPath} />
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
    actionCreator: dispatch => dispatch(actions.wallet.reset()),
    pure: false,
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
      rootPath: isLoginRoute(s.router) ? appRoutes.login : appRoutes.register,
      isLoginRoute: isLoginRoute(s.router),
    }),
    options: {
      pure: false,
    },
  }),
)(WalletSelectorComponent);
