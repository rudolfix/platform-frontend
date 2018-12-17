import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./EndTimeWidget.module.scss";

interface IExternalProps {
  endTime: Date | undefined;
}

const EndTimeWidget: React.SFC<IExternalProps> = ({ endTime }) => {
  return (
    <span className={styles.endTime}>
      {endTime && (
        <FormattedMessage
          id="shared-component.eto-overview.invest.ends-in"
          values={{
            endsIn: <FormattedRelative value={endTime} style="numeric" />,
          }}
        />
      )}
    </span>
  );
};

export { EndTimeWidget };
