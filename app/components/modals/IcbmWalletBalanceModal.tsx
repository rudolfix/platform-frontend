import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";

import { actions } from "../../modules/actions";
import {
  selectAllNeumakrsDueIcbmModal,
  selectEtherBalanceIcbmModal,
  selectIcbmWalletEthAddress,
} from "../../modules/icbmWalletBalanceModal/selectors";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { Button, ButtonLink } from "../shared/buttons";
import { CopyToClipboard } from "../shared/CopyToClipboard";
import { InlineIcon } from "../shared/InlineIcon";
import { Money } from "../shared/Money";
import { SectionHeader } from "../shared/SectionHeader";
import { ModalComponentBody } from "./ModalComponentBody";

import * as iconEth from "../../assets/img/eth_icon.svg";
import * as iconDownload from "../../assets/img/inline_icons/download.svg";
import * as iconNeu from "../../assets/img/neu_icon.svg";
import { appRoutes } from "../appRoutes";
import { ConfettiEthereum } from "../landing/parts/ConfettiEthereum";
import { SpinningEthereum } from "../landing/parts/SpinningEthereum";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  etherBalance: string;
  ethAddress?: string;
  neumarksDue: string;
  isLoading: boolean;
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
}

const HighlightedField: React.SFC<IProps> = ({ label, value, icon, link, withCopy }) => {
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
      <div className={cn(styles.highlightedField, withCopy && "d-flex justify-content-between")}>
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

const MigrateBody: React.SFC<{ step: number }> = ({ step }) => {
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
        value="test value 1"
        withCopy
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.to-smart-contract" />
        }
        value="test value 2"
        withCopy
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.amount-to-sent" />
        }
        value="test value 3"
        withCopy
      />
      <HighlightedField
        label={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.gas-limit" />
        }
        value="test value 4"
        withCopy
      />
      <HighlightedField
        label={<FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.data" />}
        value="test value 5"
        withCopy
      />
    </>
  );
};

const BalanceFooter: React.SFC<{ startMigration: () => void }> = ({ startMigration }) => {
  return (
    <Button onClick={startMigration}>
      <FormattedMessage id="settings.modal.icbm-wallet-balance.button" />
    </Button>
  );
};

type TTransactionStatus = "success" | "waiting";

const MigrateFooter: React.SFC<{
  goToNextStep: () => void;
  step: number;
  transactionStatus: TTransactionStatus;
}> = ({ goToNextStep, step, transactionStatus }) => {
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
            {step === 1 && (
              <Button layout="secondary" onClick={goToNextStep}>
                <FormattedMessage id="settings.modal.icbm-wallet-balance.button.next-step" />
              </Button>
            )}
            {step === 2 && (
              <ButtonLink to={appRoutes.portfolio} layout="secondary">
                <FormattedMessage id="settings.modal.icbm-wallet-balance.button.portfolio" />
              </ButtonLink>
            )}
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

  private goToNextStep = () => {
    this.setState(prevState => ({ migrationStep: prevState.migrationStep + 1 }));
  };

  render(): React.ReactNode {
    const { isOpen, onCancel } = this.props;
    const { isMigrating, migrationStep } = this.state;

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

            {isMigrating ? <MigrateBody step={migrationStep} /> : <BalanceBody {...this.props} />}

            {isMigrating ? (
              <MigrateFooter
                transactionStatus="success"
                step={migrationStep}
                goToNextStep={this.goToNextStep}
              />
            ) : (
              <BalanceFooter startMigration={this.startMigration} />
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
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.icbmWalletBalanceModal.hideIcbmWalletBalanceModal()),
  }),
})(IcbmWalletBalanceComponent);
