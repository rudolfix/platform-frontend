import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { selectIncomingPayoutEurEquiv } from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { ButtonInline } from "../../../shared/buttons/ButtonInline";
import { ButtonLink } from "../../../shared/buttons/ButtonLink";
import { ETheme, Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { InlineIcon } from "../../../shared/icons/InlineIcon";
import { TimeLeft } from "../../../shared/TimeLeft.unsafe";
import { IIncomingPayoutData } from "../my-portfolio-widget/IncomingPayoutPending";

import warningIcon from "../../../../assets/img/inline_icons/error.svg";
import styles from "./MyNeuWidget.module.scss";

type TStateProps = {
  incomingPayoutEurEquiv: string;
};

type TEndDate = {
  endDate: Date;
};

type TDispatchProps = {
  loadPayoutsData: () => void;
};

type TPendingPayoutProps = TStateProps & TEndDate & TDispatchProps;

const MyNeuWidgetPendingPayoutLayout: React.FunctionComponent<TPendingPayoutProps> = ({
  incomingPayoutEurEquiv,
  endDate,
  loadPayoutsData,
}) => (
  <section className={styles.payoutContainer}>
    <InlineIcon svgIcon={warningIcon} className={styles.warningIcon} />
    <div>
      <FormattedMessage
        id="dashboard.my-neu-widget.pending-payout"
        values={{
          separator: <br />,
          time: <TimeLeft finalTime={endDate} refresh={true} onFinish={loadPayoutsData} />,
          amount: (
            <Money
              value={incomingPayoutEurEquiv}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.EUR}
              outputFormat={ENumberOutputFormat.FULL}
              theme={ETheme.GREEN}
              className={styles.payoutAmount}
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

const MyNeuWidgetPendingPayout = compose<TPendingPayoutProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      incomingPayoutEurEquiv: selectIncomingPayoutEurEquiv(state),
    }),
    dispatchToProps: dispatch => ({
      loadPayoutsData: () => {
        dispatch(actions.investorEtoTicket.getIncomingPayouts());
        dispatch(actions.investorEtoTicket.loadClaimables());
      },
    }),
  }),
  withProps<TEndDate, IIncomingPayoutData>({
    endDate: moment()
      .utc()
      .add(1, "day")
      .startOf("day")
      .toDate(),
  }),
)(MyNeuWidgetPendingPayoutLayout);

export { MyNeuWidgetPendingPayoutLayout, MyNeuWidgetPendingPayout };
