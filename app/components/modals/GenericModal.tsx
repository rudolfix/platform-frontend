import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal, Row } from "reactstrap";

import { actions } from "../../modules/actions";
import {
  IGenericModal,
  selectGenericModalObj,
  selectIsOpen,
} from "../../modules/genericModal/reducer";
import { appConnect } from "../../store";

import { Button } from "../shared/Buttons";
import { ModalComponentBody } from "./ModalComponentBody";

import * as successIcon from "../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../assets/img/notifications/warning.svg";
import * as styles from "./GenericModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
}

interface IDispatchProps {
  onDismiss: () => void;
}

export const genericModalIcons = {
  check: <img src={successIcon} className={styles.icon} aria-hidden="true" />,
  exclamation: <img src={warningIcon} className={styles.icon} aria-hidden="true" />,
};

const GenericModalComponent: React.SFC<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  genericModalObj,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onDismiss}>
      <ModalComponentBody onClose={onDismiss}>
        <Row className="mt-5 justify-content-center">
          <h5 data-test-id="components.modals.generic-modal.title">
            {genericModalObj && genericModalObj.title}
          </h5>
        </Row>

        <Row className="mb-5 justify-content-center">
          <div className={styles.content}>
            {genericModalObj && genericModalObj.icon && genericModalIcons[genericModalObj.icon]}{" "}
            {genericModalObj && genericModalObj.description}
          </div>
        </Row>

        <Row className="mb-5 justify-content-center">
          <Button onClick={onDismiss} data-test-id="generic-modal-dismiss-button">
            <FormattedMessage id="modal.generic.button.dismiss" />
          </Button>
        </Row>
      </ModalComponentBody>
    </Modal>
  );
};

export const GenericModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsOpen(s.genericModal),
    genericModalObj: selectGenericModalObj(s.genericModal),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.genericModal.hideGenericModal()),
  }),
})(GenericModalComponent);
