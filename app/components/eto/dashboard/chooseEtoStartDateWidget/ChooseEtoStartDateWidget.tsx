import * as cn from "classnames";
import { Moment } from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import {
  selectEtoStartDate,
  selectIssuerEtoPreviewCode,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { DatePicker } from "../../../shared/DatePicker";
import { Panel } from "../../../shared/Panel";

import * as styles from "../../etoContentWidget.module.scss";

interface IStateProps {
  canChangeDate: boolean;
  startDate?: Date;
}

interface IDispatchProps {
  setEtoDate: (time: string | Moment) => void;
  uploadDate: () => void;
}

type TProps = IStateProps & IDispatchProps;

const ChooseEtoStartDateWidgetComponent: React.SFC<TProps> = ({
  startDate,
  setEtoDate,
  canChangeDate,
  uploadDate,
}) => {
  return (
    <Panel headerText={<FormattedMessage id="eto.settings.eto-start-date" />}>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.choose-pre-eto-date.book-building-will-stop" />
        </p>
        <p className={cn(styles.text)}>
          {canChangeDate ? (
            <FormattedMessage id="eto.settings.choose-eto-start-date" />
          ) : (
            <FormattedMessage id="eto.settings.changing-eto-start-date-not-possible" />
          )}
        </p>
        <div className="d-flex justify-content-center">
          <DatePicker
            value={startDate}
            onChange={setEtoDate}
            inputProps={{ disabled: !canChangeDate }}
            timeFormat={false}
            utc={true}
          />
        </div>
        {canChangeDate && (
          <div className="d-flex justify-content-center">
            <Button onClick={uploadDate}>
              <FormattedMessage id="eto.settings.update-eto-start-date" />
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
};

const ChooseEtoStartDateWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      canChangeDate: true,
      startDate: selectEtoStartDate(state, selectIssuerEtoPreviewCode(state)!),
    }),
    dispatchToProps: dispatch => ({
      setEtoDate: (time: Moment | string) => {
        dispatch(actions.etoFlow.setNewStartDate((time as Moment).toDate()));
      },
      uploadDate: () => {
        dispatch(actions.etoFlow.uploadStartDate());
      },
    }),
  }),
)(ChooseEtoStartDateWidgetComponent);

export { ChooseEtoStartDateWidgetComponent, ChooseEtoStartDateWidget };
