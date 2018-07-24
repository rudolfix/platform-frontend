import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { Panel } from "../../../shared/Panel";

import * as styles from "./ChoosePreEtoDateWidget.module.scss";

interface IDispatchProps {
  setEtoDate: () => void;
}

export const ChoosePreEtoDateWidgetComponent: React.SFC<IDispatchProps & IIntlProps> = ({
  intl: { formatIntlMessage },
}) => {
  return (
    <Panel headerText={formatIntlMessage("settings.choose-pre-eto-date")}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.choose-pre-eto-date.book-building-will-stop" />
        </p>
        <Col className="d-flex justify-content-center">{/* TODO: Add datePicker Component */}</Col>
      </div>
    </Panel>
  );
};

export const ChoosePreEtoDateWidget = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: () => ({
      setEtoDate: () => {},
    }),
  }),
  injectIntlHelpers,
)(ChoosePreEtoDateWidgetComponent);
