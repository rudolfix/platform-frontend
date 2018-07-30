import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal, Row } from "reactstrap";

import { actions } from "../../../modules/actions";
import { selectFileUploadAction, selectIsIpfsModalOpen } from "../../../modules/eto-flow/selectors";
import { appConnect } from "../../../store";
import { ModalComponentBody } from "../../modals/ModalComponentBody";
import { ButtonArrowRight } from "../../shared/Buttons";

import * as styles from "./EtoFileIpfsModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  onContinue?: () => void;
}

interface IDispatchProps {
  onDismiss: () => void;
}

export const EtoFileIpfsModalComponent: React.SFC<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  onContinue,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onDismiss} centered>
      <ModalComponentBody onClose={onDismiss}>
        <Row className="mb-5 justify-content-center">
          <div className={styles.content}>
            <FormattedMessage id="modal.ipfs-eto.description" />
          </div>
        </Row>

        <Row className="mb-5 justify-content-center">
          <ButtonArrowRight onClick={onContinue} data-test-id="generic-modal-dismiss-button">
            <FormattedMessage id="modal.ipfs-eto.button.continue" />
          </ButtonArrowRight>
        </Row>
      </ModalComponentBody>
    </Modal>
  );
};

export const EtoFileIpfsModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsIpfsModalOpen(s.etoFlow),
    onContinue: selectFileUploadAction(s.etoFlow),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.etoFlow.hideIpfsModal()),
  }),
})(EtoFileIpfsModalComponent);
