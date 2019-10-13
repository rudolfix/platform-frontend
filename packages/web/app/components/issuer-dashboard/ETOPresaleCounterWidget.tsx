import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { InvalidETOStateError } from "../../modules/eto/errors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { isOnChain } from "../../modules/eto/utils";
import { DashboardWidget } from "../shared/dashboard-widget/DashboardWidget";
import { IPanelProps } from "../shared/Panel";
import { FancyTimeLeft } from "../shared/TimeLeft.unsafe";
import {
  calculateTimeLeft,
  localTime,
  timeZone,
  utcTime,
  weekdayLocal,
  weekdayUTC,
} from "../shared/utils";

import * as styles from "./ETOPresaleCounterWidget.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

type TProps = IExternalProps & IPanelProps;

const ETOPresaleCounterWidget: React.ComponentType<TProps> = ({ eto, columnSpan }) => {
  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const countdownDate = eto.contract.startOfStates[EETOStateOnChain.Public]!;
  const timeLeft = calculateTimeLeft(countdownDate, true) > 0;

  return (
    <DashboardWidget
      data-test-id="settings.presale-counter"
      title={<FormattedMessage id="settings.presale-counter.title" />}
      text={<FormattedMessage id="settings.presale-counter.text" />}
      columnSpan={columnSpan}
    >
      <div className={styles.etoPublicStartDate}>
        {timeLeft && <FancyTimeLeft finalTime={countdownDate} asUtc={true} refresh={true} />}
        <table className={cn(styles.date, { [styles.dateBold]: !timeLeft })}>
          <tbody>
            <tr>
              <td>UTC:</td>
              <td>{`${weekdayUTC(countdownDate)}, ${utcTime(countdownDate)}`}</td>
            </tr>
            <tr>
              <td>{`${timeZone()}: `}</td>
              <td>{`${weekdayLocal(countdownDate)}, ${localTime(countdownDate)}`}</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.publicStartInfo}>
          <FormattedMessage id="settings.presale-counter.public-start-info" />
        </p>
      </div>
    </DashboardWidget>
  );
};

export { ETOPresaleCounterWidget };
