import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import { IWalletMigrationData } from "../../modules/icbmWalletBalanceModal/reducer";
import {
  selectAllNeumakrsDueIcbmModal,
  selectEtherBalanceIcbmModal,
  selectIcbmWalletEthAddress,
  selectWalletMigrationData,
} from "../../modules/icbmWalletBalanceModal/selectors";
import { SelectIsVerificationFullyDone } from "../../modules/selectors";
import { selectLockedWalletConnected } from "../../modules/wallet/selectors";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { appRoutes } from "../appRoutes";
import { ConfettiEthereum } from "../landing/parts/ConfettiEthereum";
import { SpinningEthereum } from "../landing/parts/SpinningEthereum";
import { Button } from "../shared/buttons";
import { ButtonLink } from "../shared/buttons/ButtonLink";
import { CopyToClipboard } from "../shared/CopyToClipboard";
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
  isLoading: boolean;
  walletMigrationData?: IWalletMigrationData;
  isVerificationFullyDone: boolean;
  lockedWalletConnected: boolean;
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
  withCopy?: boolean;
  dataTestId?: string;
}

const HighlightedField: React.SFC<IProps> = ({
  label,
  value,
  icon,
  link,
  withCopy,
  dataTestId,
}) => {
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
      <div
        className={cn(styles.highlightedField, withCopy && "d-flex justify-content-between")}
        data-test-id={dataTestId}
      >
        {withCopy && <CopyToClipboard value={value} />}
        {value}
      </div>
    </div>
  );
};

const BalanceBody: React.SFC<IStateProps> = ({
  ethAddress,
  isLoading,
  neumarksDue,
  etherBalance,
}) => {
  return (
    <>
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.icbm-wallet-address.label" />
        }
        value={ethAddress || ""}
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.neu-balance.label" />}
        value={isLoading ? <>Loading</> : <Money currency="neu" value={neumarksDue || "0"} />}
        icon={iconNeu}
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.eth-balance.label" />}
        value={isLoading ? <>Loading</> : <Money value={etherBalance || "0"} currency="eth" />}
        icon={iconEth}
      />
    </>
  );
};

const MigrateBody: React.SFC<{
  icbmWalletAddress: string;
  walletMigrationData: IWalletMigrationData;
}> = ({ icbmWalletAddress, walletMigrationData }) => {
  const step = walletMigrationData.migrationStep;
  return (
    <>
      <p className={styles.description}>
        <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.description" />
      </p>
      <SectionHeader className={styles.header}>
        {step === 1 && (
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.1.title" />
        )}
        {step === 2 && (
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.2.title" />
        )}
      </SectionHeader>
      <p className={styles.description}>
        {step === 1 && (
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.1.description" />
        )}
        {step === 2 && (
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.2description" />
        )}
      </p>
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.from-icbm-wallet" />
        }
        value={icbmWalletAddress}
        withCopy
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.to-smart-contract" />
        }
        value={walletMigrationData.smartContractAddress}
        withCopy
        dataTestId="modals.icbm-balance-modal.migrate-body.to"
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.amount-to-sent" />
        }
        value={walletMigrationData.value}
        withCopy
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.gas-limit" />
        }
        value={walletMigrationData.gasLimit}
        withCopy
        dataTestId="modals.icbm-balance-modal.migrate-body.gas-limit"
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.data" />}
        value={walletMigrationData.migrationInputData}
        withCopy
        dataTestId="modals.icbm-balance-modal.migrate-body.input-data"
      />
    </>
  );
};

const BalanceFooter: React.SFC<{ startMigration: () => void; disabled?: boolean }> = ({
  startMigration,
  disabled,
}) => {
  return (
    <Button
      onClick={startMigration}
      disabled={disabled}
      data-test-id="modals.icbm-balance-modal.balance-footer.generate-transaction"
    >
      <FormattedMessage id="settings.modal.icbm-wallet-balance.button" />
    </Button>
  );
};

type TTransactionStatus = "success" | "waiting";

const MigrateFooter: React.SFC<{
  transactionStatus: TTransactionStatus;
}> = ({ transactionStatus }) => {
  return (
    <>
      {transactionStatus === "waiting" && (
        <div className={styles.footerWaiting}>
          <SpinningEthereum className={styles.animatedEthereum} />
          <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.waiting-for-transaction" />
        </div>
      )}
      {transactionStatus === "success" && (
        <div className={styles.footerSuccess}>
          <ConfettiEthereum className={styles.animatedEthereum} />
          <div>
            <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.transaction-successful" />

            <ButtonLink to={appRoutes.wallet} layout="secondary">
              <FormattedMessage id="settings.modal.icbm-wallet-balance.button.wallet" />
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
};
class IcbmWalletBalanceComponent extends React.Component<
  IStateProps & IDispatchProps,
  { isMigrating: boolean; migrationStep: number }
> {
  state = {
    isMigrating: false,
    migrationStep: 1,
  };

  private startMigration = () => {
    this.setState({ isMigrating: true });
  };

  render(): React.ReactNode {
    const {
      isOpen,
      onCancel,
      isVerificationFullyDone,
      lockedWalletConnected,
      ethAddress,
      walletMigrationData,
    } = this.props;
    const { isMigrating } = this.state;

    return (
      <Modal isOpen={isOpen} toggle={onCancel}>
        <ModalComponentBody onClose={onCancel}>
          <div className={styles.content}>
            <SectionHeader className={styles.header}>
              {isMigrating ? (
                <FormattedMessage id="settings.modal.icbm-wallet-balance.title.migrate" />
              ) : (
                <FormattedMessage id="settings.modal.icbm-wallet-balance.title.balance" />
              )}
            </SectionHeader>

            {isMigrating ? (
              <MigrateBody
                icbmWalletAddress={ethAddress!}
                walletMigrationData={walletMigrationData!}
              />
            ) : (
              <BalanceBody {...this.props} />
            )}

            {isMigrating ? (
              lockedWalletConnected && <MigrateFooter transactionStatus="success" />
            ) : (
              <BalanceFooter
                disabled={!isVerificationFullyDone}
                startMigration={this.startMigration}
              />
            )}
          </div>
        </ModalComponentBody>
      </Modal>
    );
  }
}

export const IcbmWalletBalanceModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.icbmWalletBalanceModal.isOpen,
    isLoading: state.icbmWalletBalanceModal.loading,
    ethAddress: selectIcbmWalletEthAddress(state.icbmWalletBalanceModal),
    neumarksDue: selectAllNeumakrsDueIcbmModal(state.icbmWalletBalanceModal),
    etherBalance: selectEtherBalanceIcbmModal(state.icbmWalletBalanceModal),
    isVerificationFullyDone: SelectIsVerificationFullyDone(state),
    walletMigrationData: selectWalletMigrationData(state.icbmWalletBalanceModal),
    lockedWalletConnected: selectLockedWalletConnected(state.wallet),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal()),
  }),
})(IcbmWalletBalanceComponent);
