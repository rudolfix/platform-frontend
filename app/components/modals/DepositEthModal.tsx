import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import { selectEthereumAddress } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { AccountAddress } from "../shared/AccountAddress";
import { EthereumQRCode } from "../shared/EthereumQRCode";
import { ModalComponentBody } from "./ModalComponentBody";

import * as styles from "./DepositEthModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  address: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

const DepositEthModalComponent: React.SFC<IStateProps & IDispatchProps> = props => {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <div className={styles.contentWrapper}>
<<<<<<< HEAD
          <div className={styles.qrCodeWrapper} />
=======
          <div className={styles.qrCodeWrapper}>
            <EthereumQRCode
              to={props.address}
              value={0}
              gas={0}
            />
          </div>
>>>>>>> 3f6e07a2... Add EthereumQRCode component
          <h2 className={styles.title}>
            <FormattedMessage id="modal.deposit-eth.title" />
          </h2>
          <p className={styles.description}>
            <FormattedMessage id="modal.deposit-eth.description" />
          </p>
          <AccountAddress address={props.address} />
        </div>
      </ModalComponentBody>
    </Modal>
  );
};

export const DepositEthModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.depositEthModal.isOpen,
    address: selectEthereumAddress(state.web3),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.depositEthModal.hideDepositEthModal()),
  }),
})(DepositEthModalComponent);
