import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Modal, Row } from "reactstrap";

import { Formik } from "formik";
import { actions } from "../../modules/actions";
import { selectEthereumAddress } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { Button } from "../shared/Buttons";
import { ModalComponentBody } from "./ModalComponentBody";

import { FormField } from "../shared/forms/forms";
import * as styles from "./SendEthModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  address: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

const SendEthModalComponent: React.SFC<IStateProps & IDispatchProps> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.title}>
            <FormattedMessage id="modal.sent-eth.title" />
          </h2>

          <Formik initialValues={{}} onSubmit={() => {}}>
            {() => (
              <Row>
                <Col xs={12}>
                  <FormField name="" label={<FormattedMessage id="modal.sent-eth.to-address" />} />
                </Col>
                <Col xs={12}>
                  <FormField
                    name=""
                    label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                  />
                </Col>
                <Col xs={12}>
                  <FormField name="" label={<FormattedMessage id="modal.sent-eth.gas-limit" />} />
                </Col>
                <Col xs={12} className="text-center">
                  <Button type="submit">
                    <FormattedMessage id="modal.sent-eth.button" />
                  </Button>
                </Col>
              </Row>
            )}
          </Formik>
        </div>
      </ModalComponentBody>
    </Modal>
  );
};

export const SendEthModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.sendEthModal.isOpen,
    address: selectEthereumAddress(state.web3),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.sendEthModal.hideSendEthModal()),
  }),
})(SendEthModalComponent);
