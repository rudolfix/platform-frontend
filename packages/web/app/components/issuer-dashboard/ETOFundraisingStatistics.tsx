import { Eth, Eur, EurToken, WholeEur } from "@neufund/design-system";
import {
  EEtoState,
  etoModuleApi,
  InvalidETOStateError,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { convertFromUlps, divideBigNumbers, multiplyBigNumbers } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { selectEtherPriceEur } from "../../modules/shared/tokenPrice/selectors";
import { appConnect } from "../../store";
import { DashboardWidget } from "../shared/dashboard-widget/DashboardWidget";
import { IPanelProps } from "../shared/Panel";

import * as styles from "./ETOFundraisingStatistics.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface IStateProps {
  etherPriceEur: string;
}

interface IWithProps {
  etherTokenEurEquiv: string;
  averageInvestmentEur: string;
}

type IProps = IExternalProps & IPanelProps & IWithProps;

const ETOFundraisingStatisticsLayout: React.ComponentType<IProps> = ({
  eto,
  columnSpan,
  etherTokenEurEquiv,
  averageInvestmentEur,
}) => {
  if (!etoModuleApi.utils.isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const {
    totalEquivEur,
    etherTokenBalance,
    euroTokenBalance,
    totalInvestors,
  } = eto.contract.totalInvestment;

  return (
    <DashboardWidget
      data-test-id="settings.fundraising-statistics"
      title={<FormattedMessage id="settings.fundraising-statistics.title" />}
      columnSpan={columnSpan}
    >
      <section className={styles.groupWrapper}>
        <span className={styles.label}>
          <FormattedMessage id="settings.fundraising-statistics.total-investment" />
        </span>
        <WholeEur value={totalEquivEur} />
        <span className={styles.label}>
          <FormattedMessage id="settings.fundraising-statistics.eth-investment" />
        </span>
        <span>
          <Eth value={etherTokenBalance} />
          {" ≈ "}
          <Eur value={etherTokenEurEquiv} />
        </span>
        <span className={styles.label}>
          <FormattedMessage id="settings.fundraising-statistics.neur-investment" />
        </span>
        <EurToken value={euroTokenBalance} />
        <span className={styles.label}>
          <FormattedMessage id="settings.fundraising-statistics.average-investment-value" />
        </span>
        <Eur value={averageInvestmentEur} />
        <span className={styles.label}>
          <FormattedMessage id="settings.fundraising-statistics.total-investors" />
        </span>
        <span>{totalInvestors}</span>
      </section>
      {/*  TODO: Add CSV download */}
    </DashboardWidget>
  );
};

const ETOFundraisingStatistics = compose<IProps, IExternalProps & IPanelProps>(
  appConnect<IStateProps, {}>({
    stateToProps: state => ({
      etherPriceEur: selectEtherPriceEur(state),
    }),
  }),
  withProps<IWithProps, IProps & IStateProps>(props => {
    if (!etoModuleApi.utils.isOnChain(props.eto)) {
      throw new InvalidETOStateError(props.eto.state, EEtoState.ON_CHAIN);
    }

    return {
      etherTokenEurEquiv: convertFromUlps(
        multiplyBigNumbers([
          props.eto.contract.totalInvestment.etherTokenBalance,
          props.etherPriceEur,
        ]),
      ).toString(),
      averageInvestmentEur: divideBigNumbers(
        props.eto.contract.totalInvestment.totalEquivEur,
        props.eto.contract.totalInvestment.totalInvestors,
      ),
    };
  }),
)(ETOFundraisingStatisticsLayout);

export { ETOFundraisingStatistics, ETOFundraisingStatisticsLayout };
