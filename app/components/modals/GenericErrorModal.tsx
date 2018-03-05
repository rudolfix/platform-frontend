import * as React from "react";
import { Modal, ModalBody, Row } from "reactstrap";

import { actions } from "../../modules/actions";
import { IErrorObj } from "../../modules/genericErrorModal/reducer";
import { appConnect } from "../../store";
import { ButtonPrimary } from "../shared/Buttons";

interface IStateProps {
  isOpen: boolean;
  errorObj: IErrorObj;
}

interface IDispatchProps {
  onCancel: () => void;
}

const GenericErrorModalComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel}>
    <ModalBody>
      <Row className="mt-5 justify-content-center">
        <h5>{props.errorObj.mainError}</h5>
      </Row>
      <Row className="mb-5 justify-content-center">
        <p>{props.errorObj.errorMsg}</p>
      </Row>
      <Row className="mb-5 justify-content-center">
        <ButtonPrimary onClick={props.onCancel}> Cancel </ButtonPrimary>
      </Row>
    </ModalBody>
  </Modal>
);

export const GenericErrorModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: s.genericErrorModal.isOpen,
    errorObj: s.genericErrorModal.errorObj,
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.genericErrorModal.hideError()),
  }),
})(GenericErrorModalComponent);
