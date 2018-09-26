import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Button } from "../../../shared/buttons";

import * as styles from "./RefundWidget.module.scss";

const RefundWidget: React.SFC = () => {
  return (
    <div className={styles.refundWidget}>
      <div className={styles.message}>
        <FormattedMessage id="shared-component.eto-overview.refund" />
      </div>
      <Button>
        <FormattedMessage id="shared-component.eto-overview.claim-your-eth-neur" />
      </Button>
    </div>
  );
};

export { RefundWidget };
