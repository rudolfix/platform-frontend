import {
  EEtoState,
  EETOStateOnChain,
  etoModuleApi,
  InvalidETOStateError,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { nonNullable } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { DashboardWidget } from "../shared/dashboard-widget/DashboardWidget";
import { IPanelProps } from "../shared/Panel";
import { TimeLeftWithUTC } from "../shared/TimeLeftWithUTC";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface IFundraisingProps extends IPanelProps {
  countdownDate: Date;
}

type TProps = IExternalProps & IPanelProps;

const ETOFundraisingPresaleCounterWidget: React.FunctionComponent<IFundraisingProps> = ({
  countdownDate,
  columnSpan,
}) => (
  <DashboardWidget
    data-test-id="settings.presale-counter"
    title={<FormattedMessage id="settings.presale-counter.title" />}
    text={<FormattedMessage id="settings.presale-counter.text" />}
    columnSpan={columnSpan}
  >
    <TimeLeftWithUTC countdownDate={countdownDate}>
      <FormattedMessage id="settings.presale-counter.public-start-info" />
    </TimeLeftWithUTC>
  </DashboardWidget>
);

const ETOFundraisingPublicCounterWidget: React.FunctionComponent<IFundraisingProps> = ({
  countdownDate,
  columnSpan,
}) => (
  <DashboardWidget
    data-test-id="settings.public-sale-counter"
    title={<FormattedMessage id="settings.public-sale-counter.title" />}
    text={<FormattedMessage id="settings.public-sale-counter.text" />}
    columnSpan={columnSpan}
  >
    <TimeLeftWithUTC countdownDate={countdownDate} />
  </DashboardWidget>
);

const ETOFundraisingCounterWidget: React.FunctionComponent<TProps> = ({ eto, columnSpan }) => {
  if (!etoModuleApi.utils.isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  switch (eto.contract.timedState) {
    case EETOStateOnChain.Whitelist: {
      const countdownDate = nonNullable(eto.contract.startOfStates[EETOStateOnChain.Public]);
      return (
        <ETOFundraisingPresaleCounterWidget countdownDate={countdownDate} columnSpan={columnSpan} />
      );
    }
    case EETOStateOnChain.Public: {
      const countdownDate = nonNullable(eto.contract.startOfStates[EETOStateOnChain.Signing]);
      return (
        <ETOFundraisingPublicCounterWidget countdownDate={countdownDate} columnSpan={columnSpan} />
      );
    }
    default:
      return null;
  }
};

export { ETOFundraisingCounterWidget };
