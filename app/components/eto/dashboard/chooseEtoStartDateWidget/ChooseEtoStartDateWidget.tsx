import * as cn from "classnames";
import { Moment } from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { DatePicker } from "../../../shared/DatePicker";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../etoContentWidget.module.scss";

interface IStateProps {
  canChangeDate: boolean;
  startDate?: Date;
}

interface IDispatchProps {
  setEtoDate: (time: string | Moment) => void;
}

type TProps = IStateProps & IDispatchProps;

const ChooseEtoStartDateWidgetComponent: React.SFC<TProps> = ({
  startDate,
  setEtoDate,
  canChangeDate,
}) => {
  return (
    <Panel headerText={<FormattedMessage id="eto.settings.eto-start-date" />}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage
            id={
              canChangeDate
                ? "eto.settings.choose-eto-start-date"
                : "eto.settings.changing-eto-start-date-not-possible"
            }
          />
        </p>
        <div className="d-flex justify-content-center">
          <DatePicker
            value={startDate}
            onChange={setEtoDate}
            inputProps={{ disabled: !canChangeDate }}
          />
        </div>
      </div>
    </Panel>
  );
};

const ChooseEtoStartDateWidget = compose<React.SFC>(
  appConnect<IDispatchProps>({
    dispatchToProps: () => ({
      setEtoDate: () => {},
    }),
  }),
)(ChooseEtoStartDateWidgetComponent);

export { ChooseEtoStartDateWidgetComponent, ChooseEtoStartDateWidget };
