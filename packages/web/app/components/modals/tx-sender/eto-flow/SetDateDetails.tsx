import { ETxType } from "@neufund/shared-modules";
import { localTime, timeZone, utcTime, weekdayLocal, weekdayUTC } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TimeLeft } from "../../../shared/TimeLeft.unsafe";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const SetDateDetails: TransactionDetailsComponent<ETxType.ETO_SET_DATE> = ({
  additionalData,
  className,
  txTimestamp,
}) => {
  const newStartDate = additionalData.newStartDate;
  const timezone = timeZone();

  return (
    <InfoList className={className}>
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.time-to-start-date" />}
        value={<TimeLeft refresh={false} asUtc={false} finalTime={newStartDate} />}
        data-test-id="set-eto-date-summary-time-to-eto"
      />
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date-utc" />}
        value={`${weekdayUTC(newStartDate)}, ${utcTime(newStartDate)}`}
      />
      <InfoRow
        caption={
          <FormattedMessage
            id="eto.settings.eto-start-date-summary.new-start-date-local"
            values={{ timezone }}
          />
        }
        value={`${weekdayLocal(newStartDate)}, ${localTime(newStartDate)}`}
      />
      {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
    </InfoList>
  );
};

export { SetDateDetails };
