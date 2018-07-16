import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";
import { appRoutes } from "../../appRoutes";

import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { ButtonArrowRight } from "../../shared/Buttons";
import { Panel } from "../../shared/Panel";

import * as styles from "./UploadProspectusWidget.module.scss";


export const UploadProspectusWidgetComponent: React.SFC<IIntlProps> = ({
  intl: { formatIntlMessage },
}) => {
  return (
    <Panel headerText={formatIntlMessage("settings.upload-prospectus.title")}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />
        </p>
        <Col className="d-flex justify-content-center">
          <Link to={appRoutes.documents}>
            <ButtonArrowRight>
              <FormattedMessage id="settings.upload-prospectus.title" />
            </ButtonArrowRight>
          </Link>
        </Col>
      </div>
    </Panel>
  );
};

export const UploadProspectusWidget = compose<React.SFC>(injectIntlHelpers)(
  UploadProspectusWidgetComponent,
);
