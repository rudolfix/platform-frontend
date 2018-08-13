import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import { IWalletStateData } from "../../modules/wallet/reducer";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { InlineIcon } from "../shared/InlineIcon";
import { SectionHeader } from "../shared/SectionHeader";
import { ModalComponentBody } from "./ModalComponentBody";

import * as iconEth from "../../assets/img/eth_icon.svg";
import * as iconDownload from "../../assets/img/inline_icons/download.svg";
import * as iconNeu from "../../assets/img/neu_icon.svg";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  walletData?: Partial<IWalletStateData>;
  ethAddress?: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

interface IProps {
  label: TTranslatedString;
  value: string | number;
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
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.onCancel}>
        <ModalComponentBody onClose={this.props.onCancel}>
          <div className={styles.content}>
            <SectionHeader className={styles.header}>
              <FormattedMessage id="settings.modal.icbm-wallet-balance.title" />
            </SectionHeader>
            <HighlightedField
              label={
                <FormattedMessage id="settings.modal.icbm-wallet-balance.icbm-wallet-address.label" />
              }
              value={this.props.ethAddress || ""}
            />
            <HighlightedField
              label={<FormattedMessage id="settings.modal.icbm-wallet-balance.neu-balance.label" />}
              value={
                (this.props.walletData && this.props.walletData.euroTokenICBMLockedBalance) || 0
              }
              icon={iconNeu}
              link={{
                title: (
                  <FormattedMessage id="settings.modal.icbm-wallet-balance.neu-balance.link" />
                ),
                url: "#0",
              }}
            />
            <HighlightedField
              label={<FormattedMessage id="settings.modal.icbm-wallet-balance.eth-balance.label" />}
              value={
                (this.props.walletData && this.props.walletData.etherTokenICBMLockedBalance) || 0
              }
              icon={iconEth}
              link={{
                title: (
                  <FormattedMessage id="settings.modal.icbm-wallet-balance.eth-balance.link" />
                ),
                url: "#0",
              }}
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
    ethAddress: state.icbmWalletBalanceModal.ethAddress,
    walletData: state.icbmWalletBalanceModal.walletData,
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal()),
  }),
})(IcbmWalletBalanceComponent);
