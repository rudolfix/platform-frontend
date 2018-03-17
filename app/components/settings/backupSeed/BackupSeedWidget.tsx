import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";

import { selectBackupCodesVerified } from "../../../modules/auth/reducer";
import { appConnect } from "../../../store";
import { PanelDark } from "../../shared/PanelDark";

import * as styles from "./BackupSeedWidget.module.scss";

import * as successIcon from "../../../assets/img/notfications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";
import { actions } from "../../../modules/actions";
import { ButtonPrimary } from "../../shared/Buttons";

export const BackupSeedWidgetComponent: React.SFC<any> = ({
  backupCodesVerified,
  verifyBackupPhrase,
  showSeed,
}) => {
  return (
    <PanelDark
      headerText="BACKUP RECOVERY PHRASE"
      rightComponent={
        backupCodesVerified ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {backupCodesVerified ? (
        <div
          data-test-id="verified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>You have backed up your SEED. </p>
          <Col xs={12} className="d-flex justify-content-center">
            <ButtonPrimary onClick={showSeed}>View</ButtonPrimary>
          </Col>
        </div>
      ) : (
        <div
          data-test-id="unverified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            Write down your recovery phrase and keep it safe and secure. Your recovery Phrase allows
            you to restore your wallet and access your funds you forgot your password
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <ButtonPrimary onClick={verifyBackupPhrase}>Backup phrase</ButtonPrimary>
          </Col>
        </div>
      )}
    </PanelDark>
  );
};

export const BackupSeedWidget = appConnect<{}, any>({
  stateToProps: s => ({
    backupCodesVerified: selectBackupCodesVerified(s.auth),
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => {
      dispatch(actions.wallet.lightWalletBackedUp());
      dispatch(actions.routing.goToSettings());
    },
    showSeed: () => {
      dispatch(actions.showSeedModal.seedModelshow());
    },
  }),
})(BackupSeedWidgetComponent);
