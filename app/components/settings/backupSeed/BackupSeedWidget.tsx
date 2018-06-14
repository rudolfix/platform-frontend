import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";

import { selectBackupCodesVerified } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/Buttons";
import { Panel } from "../../shared/Panel";
import { settingsRoutes } from "../routes";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./BackupSeedWidget.module.scss";

interface IStateProps {
  backupCodesVerified?: boolean;
}

interface IOwnProps {
  step: number;
}
interface IDispatchProps {}

export const BackupSeedWidgetComponent: React.SFC<
  IStateProps & IDispatchProps & IIntlProps & IOwnProps
> = ({ intl: { formatIntlMessage }, backupCodesVerified, step }) => {
  return (
    <Panel
      headerText={formatIntlMessage("settings.backup-seed-widget.header", { step })}
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
          data-test-id="backup-seed-verified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="settings.backup-seed-widget.backed-up-seed" />
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <Link to={settingsRoutes.seedBackup}>
              <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
                <FormattedMessage id="settings.backup-seed-widget.view-again" />
              </Button>
            </Link>
          </Col>
        </div>
      ) : (
        <div
          data-test-id="backup-seed-unverified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="settings.backup-seed-widget.write-down-recovery-phrase" />
          </p>
          <Col xs={12} className="d-flex justify-content-center">
            <Link to={settingsRoutes.seedBackup} data-test-id="backup-seed-widget-link-button">
              <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
                <FormattedMessage id="settings.backup-seed-widget.backup-phrase" />
              </Button>
            </Link>
          </Col>
        </div>
      )}
    </Panel>
  );
};

export const BackupSeedWidgetComponentWithIntl = injectIntlHelpers<
  IStateProps & IDispatchProps & IOwnProps
>(BackupSeedWidgetComponent);

export const BackupSeedWidget = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps & IDispatchProps, IOwnProps>({
    stateToProps: s => ({
      backupCodesVerified: selectBackupCodesVerified(s.auth),
    }),
  }),
)(BackupSeedWidgetComponentWithIntl);
