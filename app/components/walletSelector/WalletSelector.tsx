import * as React from "react";
import { Col, Row } from "reactstrap";

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
}

export const WalletSelectorComponent: React.SFC<IStateProps> = ({ isMessageSigning, rootPath }) => (
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
      </>
    )}
  </LayoutRegisterLogin>
);

export const WalletSelector = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.wallet.reset()),
    pure: false,
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      isMessageSigning: s.walletSelector.isMessageSigning,
      rootPath: isLoginRoute(s.router) ? appRoutes.login : appRoutes.register,
    }),
    options: {
      pure: false,
    },
  }),
)(WalletSelectorComponent);
