import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { ButtonPrimary } from "../shared/Buttons";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { WarningAlert } from "../shared/WarningAlert";
import { MessageSignPrompt } from "../signing/MessageSignPrompt";
import * as styles from "./WalletMessageSigner.module.scss";

interface IStateProps {
  errorMsg?: string;
}

interface IDispatchProps {
  cancelSigning: () => void;
}

interface IOwnProps {
  rootPath: string;
}

export const MessageSignerComponent: React.SFC<IStateProps & IDispatchProps> = ({
  errorMsg,
  cancelSigning,
}) => (
  <>
    <MessageSignPrompt />
    {errorMsg ? (
      <Row className="justify-content-center">
        <WarningAlert className="my-4">{errorMsg}</WarningAlert>
      </Row>
    ) : (
      <LoadingIndicator className={styles.spinner} />
    )}
    <Row>
      <Col className="text-center">
        <ButtonPrimary onClick={cancelSigning}>Cancel</ButtonPrimary>
      </Col>
    </Row>
  </>
);
MessageSignerComponent.displayName = "MessageSignerComponent";

export const WalletMessageSigner = compose(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.walletSelector.messageSigningError,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      cancelSigning: () => {
        dispatch(actions.walletSelector.reset());
        dispatch(actions.routing.goTo(ownProps.rootPath));
      },
    }),
  }),
)(MessageSignerComponent);
