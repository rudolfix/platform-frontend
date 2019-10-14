import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { InvalidETOStateError } from "../../modules/eto/errors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { isOnChain } from "../../modules/eto/utils";
import { nonNullable } from "../../utils/nonNullable";
import { DashboardWidget } from "../shared/dashboard-widget/DashboardWidget";
import { IPanelProps } from "../shared/Panel";
import { TimeLeftWithUTC } from "../shared/TimeLeftWithUTC";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

type TProps = IExternalProps & IPanelProps;

const ETOPresaleCounterWidget: React.FunctionComponent<TProps> = ({ eto, columnSpan }) => {
  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const countdownDate = nonNullable(eto.contract.startOfStates[EETOStateOnChain.Public]);

  return (
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
};

export { ETOPresaleCounterWidget };
