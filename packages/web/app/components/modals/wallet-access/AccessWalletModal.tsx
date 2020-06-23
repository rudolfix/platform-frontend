import * as React from "react";

import { selectIsAccessWalletModalOpen } from "../../../modules/access-wallet/selectors";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Modal } from "../Modal";
import { AccessWallet } from "./AccessWallet";

import * as styles from "./AccessWalletModal.module.scss";

interface IModalStateProps {
  isOpen: boolean;
}

interface IModalDispatchProps {
  onCancel: () => void;
}

const AccessWalletModalComponent: React.FunctionComponent<IModalStateProps &
  IModalDispatchProps> = props => (
  <Modal isOpen={props.isOpen} onClose={props.onCancel} className={styles.main}>
    <AccessWallet />
  </Modal>
);

export const AccessWalletModal = appConnect<IModalStateProps, IModalDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsAccessWalletModalOpen(s),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.accessWallet.hideAccessWalletModal()),
  }),
})(AccessWalletModalComponent);
