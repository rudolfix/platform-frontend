import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import {
  selectAllNeumakrsDueIcbmModal,
  selectEtherBalanceIcbmModal,
  selectIcbmWalletEthAddress,
} from "../../modules/icbmWalletBalanceModal/selectors";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { InlineIcon } from "../shared/InlineIcon";
import { Money } from "../shared/Money";
import { SectionHeader } from "../shared/SectionHeader";
import { ModalComponentBody } from "./ModalComponentBody";

import * as iconEth from "../../assets/img/eth_icon.svg";
import * as iconDownload from "../../assets/img/inline_icons/download.svg";
import * as iconNeu from "../../assets/img/neu_icon.svg";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  etherBalance: string;
  ethAddress?: string;
  neumarksDue: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

interface IProps {
  label: TTranslatedString;
  value: string | React.ReactNode;
  icon?: string;
  link?: {
    title: TTranslatedString;
    url: string;
  };
}

const HighlightedField: React.SFC<IProps> = ({ label, value, icon, link }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.highlightedHeader}>
        <div>
          {icon && <img className={styles.icon} src={icon} alt="icon" />}
          <span>{label}</span>
        </div>
        {link && (
          <div>
            <InlineIcon className={styles.downloadIcon} svgIcon={iconDownload} />
            <a href={link.url} download>
              {link.title}
            </a>
          </div>
        )}
      </div>
      <div className={styles.highlightedField}>{value}</div>
    </div>
  );
};

class IcbmWalletBalanceComponent extends React.Component<IStateProps & IDispatchProps> {
  render(): React.ReactNode {
    const { isOpen, onCancel, ethAddress, etherBalance, neumarksDue } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={onCancel}>
        <ModalComponentBody onClose={onCancel}>
          <div className={styles.content}>
            <SectionHeader className={styles.header}>
              <FormattedMessage id="settings.modal.icbm-wallet-balance.title" />
            </SectionHeader>
            <HighlightedField
              label={
                <FormattedMessage id="settings.modal.icbm-wallet-balance.icbm-wallet-address.label" />
              }
              value={ethAddress || ""}
            />
            <HighlightedField
              label={<FormattedMessage id="settings.modal.icbm-wallet-balance.neu-balance.label" />}
              value={<Money currency="neu" value={neumarksDue || "0"} />}
              icon={iconNeu}
            />
            <HighlightedField
              label={<FormattedMessage id="settings.modal.icbm-wallet-balance.eth-balance.label" />}
              value={<Money value={etherBalance || "0"} currency="eth" />}
              icon={iconEth}
            />
            <p className={styles.footer}>
              <FormattedMessage id="settings.modal.icbm-wallet-balance.coming-soon" />
            </p>
          </div>
        </ModalComponentBody>
      </Modal>
    );
  }
}

export const IcbmWalletBalanceModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.icbmWalletBalanceModal.isOpen,
    ethAddress: selectIcbmWalletEthAddress(state.icbmWalletBalanceModal),
    neumarksDue: selectAllNeumakrsDueIcbmModal(state.icbmWalletBalanceModal),
    etherBalance: selectEtherBalanceIcbmModal(state.icbmWalletBalanceModal),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal()),
  }),
})(IcbmWalletBalanceComponent);
