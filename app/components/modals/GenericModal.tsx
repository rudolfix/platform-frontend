import * as React from "react";
import { Modal, Row } from "reactstrap";

import { actions } from "../../modules/actions";
import {
  IGenericModal,
  selectGenericModalObj,
  selectIsOpen,
} from "../../modules/genericModal/reducer";
import { appConnect } from "../../store";
import { ButtonPrimary } from "../shared/Buttons";
import { ModalComponentBody } from "./ModalComponentBody";

import * as styles from "./GenericModal.module.scss";

import * as successIcon from "../../assets/img/notfications/Success_small.svg";
import * as warningIcon from "../../assets/img/notfications/warning.svg";

interface IStateProps {
  isOpen: boolean;
  genericModalObj?: IGenericModal;
}

interface IDispatchProps {
  onCancel: () => void;
}

//TODO: Add typing to iconDict
const iconDict = {
  check: <img src={successIcon} className={styles.icon} aria-hidden="true" />,
  exclamation: <img src={warningIcon} className={styles.icon} aria-hidden="true" />,
};

const GenericModalComponent: React.SFC<IStateProps & IDispatchProps> = ({
  onCancel,
  isOpen,
  genericModalObj,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalComponentBody onClose={onCancel}>
        <Row className="mt-5 justify-content-center">
          <h5>{genericModalObj && genericModalObj.title}</h5>
        </Row>

        <Row className="mb-5 justify-content-center">
          <p className="-center">
            {genericModalObj && genericModalObj.icon && iconDict[genericModalObj.icon]}{" "}
            {genericModalObj && genericModalObj.description}
          </p>
        </Row>

        <Row className="mb-5 justify-content-center">
          <ButtonPrimary onClick={onCancel}> Cancel </ButtonPrimary>
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
    onCancel: () => dispatch(actions.genericModal.hideGenericModal()),
  }),
})(GenericModalComponent);
