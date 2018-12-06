import * as cn from "classnames";
import { Moment } from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { FormGroup, InputGroup } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import {
  selectCanChangePreEtoStartDate,
  selectIsNewPreEtoStartDateValid,
  selectNewPreEtoStartDate,
  selectPreEtoStartDateFromContract,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { DatePicker } from "../../../shared/DatePicker";
import { Panel } from "../../../shared/Panel";

import { selectPlatformTermsConstants } from "../../../../modules/contracts/selectors";
import * as formStyles from "../../../shared/forms/form-field/FormStyles.module.scss";
import * as styles from "../../etoContentWidget.module.scss";

interface IStateProps {
  oldDate?: Date;
  newDate?: Date;
  isNewDateValid?: boolean;
  canChangeDate: boolean;
  minOffsetPeriodInDays: string;
}

interface IDispatchProps {
  setEtoDate: (time: string | Moment) => void;
  uploadDate: () => void;
}

type TProps = IStateProps & IDispatchProps;

const ChooseEtoStartDateWidgetComponent: React.SFC<TProps> = ({
  oldDate,
  newDate,
  setEtoDate,
  canChangeDate,
  uploadDate,
  isNewDateValid,
  minOffsetPeriodInDays,
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
        <FormGroup className="justify-content-center mb-0">
          <InputGroup>
            <DatePicker
              value={newDate || oldDate}
              onChange={setEtoDate}
              inputProps={{ disabled: !canChangeDate }}
              timeFormat={false}
              utc={true}
            />
          </InputGroup>
          {newDate &&
            !isNewDateValid && (
              <div className={formStyles.errorLabel}>
                <FormattedMessage
                  id="eto.settings.error-message.eto-start-date-too-early"
                  values={{ days: minOffsetPeriodInDays }}
                />
              </div>
            )}
        </FormGroup>
        {canChangeDate && (
          <div className="d-flex justify-content-center">
            <Button onClick={uploadDate} disabled={!(newDate && isNewDateValid)}>
              {oldDate ? (
                <FormattedMessage id="eto.settings.change-eto-start-date" />
              ) : (
                <FormattedMessage id="eto.settings.set-eto-start-date" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
};

const ChooseEtoStartDateWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const constants = selectPlatformTermsConstants(state);
      return {
        newDate: selectNewPreEtoStartDate(state),
        oldDate: selectPreEtoStartDateFromContract(state),
        canChangeDate: selectCanChangePreEtoStartDate(state),
        isNewDateValid: selectIsNewPreEtoStartDateValid(state),
        minOffsetPeriodInDays: constants.DATE_TO_WHITELIST_MIN_DURATION.div(60 * 60 * 24).toFixed(),
      };
    },
    dispatchToProps: dispatch => ({
      setEtoDate: (time: Moment | string) => {
        if (typeof time === "string") {
          // sting entered in input field, that cannot be parsed to Date
          dispatch(actions.etoFlow.setNewStartDate());
        } else {
          dispatch(actions.etoFlow.setNewStartDate(time.toDate()));
        }
      },
      uploadDate: () => {
        dispatch(actions.etoFlow.uploadStartDate());
      },
    }),
  }),
)(ChooseEtoStartDateWidgetComponent);

export { ChooseEtoStartDateWidgetComponent, ChooseEtoStartDateWidget };
