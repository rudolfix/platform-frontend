import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Modal, Row } from "reactstrap";

import { Formik } from "formik";
import { actions } from "../../modules/actions";
import { selectEthereumAddress } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { Button } from "../shared/Buttons";
import { FormFieldImportant } from "../shared/forms/formField/FormFieldImportant";
import { ModalComponentBody } from "./ModalComponentBody";

import { SpinningEthereum } from "../landing/parts/SpinningEthereum";
import * as styles from "./WithdrawModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  address: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

const WithdrawComponent: React.SFC<IStateProps & IDispatchProps> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <div className={styles.contentWrapper}>

          <SpinningEthereum />

          <h3 className={styles.title}><FormattedMessage id="modal.sent-eth.send-ether" /></h3>

          <Formik initialValues={{}} onSubmit={() => {}}>
            {() => (
              <Row>
                <Col xs={12} className="mb-3">
                  <FormFieldImportant
                    name=""
                    label={<FormattedMessage id="modal.sent-eth.to-address" />}
                  />
                </Col>
                <Col xs={12} className="mb-3">
                  <FormFieldImportant
                    name=""
                    label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                  />
                </Col>
                <Col xs={12} className="mb-4">
                  <FormFieldImportant
                    name=""
                    label={<FormattedMessage id="modal.sent-eth.gas-limit" />}
                  />
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

export const WithdrawModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.sendEthModal.isOpen,
    address: selectEthereumAddress(state.web3),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.sendEthModal.hideSendEthModal()),
  }),
})(WithdrawComponent);
