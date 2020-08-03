import { ButtonInline, Eur } from "@neufund/design-system";
import { getTomorrowsDate } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { ButtonLink } from "../../../shared/buttons";
import { InlineIcon } from "../../../shared/icons";
import { TimeLeftWithSeconds } from "../../../shared/TimeLeft.unsafe";

import warningIcon from "../../../../assets/img/inline_icons/info.svg";
import * as styles from "./MyNeuWidget.module.scss";

type TExternalProps = {
  incomingPayoutEurEquiv: string;
  loadPayoutsData: () => void;
};

const MyNeuWidgetPendingPayoutLayout: React.FunctionComponent<TExternalProps> = ({
  incomingPayoutEurEquiv,
  loadPayoutsData,
}) => (
  <section className={styles.payoutContainer} data-test-id="my-neu-widget-payout-pending">
    <InlineIcon svgIcon={warningIcon} className={styles.warningIcon} />
    <div>
      <FormattedMessage
        id="dashboard.my-neu-widget.pending-payout"
        values={{
          separator: <br />,
          time: (
            <TimeLeftWithSeconds
              className="font-weight-bold"
              finalTime={getTomorrowsDate()}
              refresh={true}
              onFinish={loadPayoutsData}
            />
          ),
          amount: (
            <Eur
              value={incomingPayoutEurEquiv}
              className={cn(styles.payoutAmount, "text-nowrap")}
            />
          ),
        }}
      />
      <ButtonLink
        to={externalRoutes.incomingPayoutBlogPost}
        component={ButtonInline}
        className={styles.buttonPayout}
      >
        <FormattedMessage id="dashboard.my-neu-widget.pending-payout-more" />
      </ButtonLink>
    </div>
  </section>
);
export { MyNeuWidgetPendingPayoutLayout };
