import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { DatePicker } from "../../../shared/DatePicker";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../etoContentWidget.module.scss";

interface IDispatchProps {
  setEtoDate: () => void;
}

const ChoosePreEtoDateWidgetComponent: React.SFC<IDispatchProps & IIntlProps> = ({
  intl: { formatIntlMessage },
}) => {
  return (
    <Panel headerText={formatIntlMessage("settings.choose-pre-eto-date")}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.choose-pre-eto-date.book-building-will-stop" />
        </p>
        <Col className="d-flex justify-content-center">
          <DatePicker />
        </Col>
      </div>
    </Panel>
  );
};

const ChoosePreEtoDateWidget = compose<React.SFC>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IDispatchProps>({
    dispatchToProps: () => ({
      setEtoDate: () => {},
    }),
  }),
  injectIntlHelpers,
)(ChoosePreEtoDateWidgetComponent);

export { ChoosePreEtoDateWidgetComponent, ChoosePreEtoDateWidget };
