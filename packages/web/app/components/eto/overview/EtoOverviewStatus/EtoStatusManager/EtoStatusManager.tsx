import {
  EETOStateOnChain,
  EEtoSubState,
  etoModuleApi,
  investorPortfolioModuleApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import * as React from "react";
import { compose } from "recompose";

import { appConnect } from "../../../../../store";
import { withContainer } from "../../../../shared/hocs/withContainer";
import { CampaigningActivatedWidget } from "../CampaigningWidget/CampaigningActivatedWidget";
import { ClaimWidget } from "../ClaimRefundWidget/ClaimWidget";
import { RefundWidget } from "../ClaimRefundWidget/RefundWidget";
import { CounterWidget } from "../CounterWidget";
import { EtoMaxCapExceededWidget } from "../EtoMaxCapExceeded";
import { InvestmentWidget } from "../InvestmentWidget/InvestmentWidget";

import * as styles from "../EtoOverviewStatus.module.scss";

interface IExternalProps {
  isEmbedded: boolean;
  eto: TEtoWithCompanyAndContractReadonly;
}

interface IStateProps {
  isEligibleToPreEto: boolean;
  maxCapExceeded: boolean;
}

const EtoStatusManagerContainer: React.FunctionComponent = ({ children }) => (
  <div className={styles.etoDataWrapper}>{children}</div>
);

const EtoStatusComponentChooser: React.FunctionComponent<IStateProps & IExternalProps> = ({
  eto,
  isEligibleToPreEto,
  maxCapExceeded,
  isEmbedded,
}) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = etoModuleApi.utils.isOnChain(eto)
    ? eto.contract.timedState
    : EETOStateOnChain.Setup;
  const isEtoActive =
    (isEligibleToPreEto && timedState === EETOStateOnChain.Whitelist) ||
    timedState === EETOStateOnChain.Public;

  if (maxCapExceeded && isEtoActive) {
    return <EtoMaxCapExceededWidget eto={eto} />;
  }

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      let nextStateStartDate;
      const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;

      const isNextStateStartDateSet =
        eto.contract &&
        (eto.subState === EEtoSubState.COUNTDOWN_TO_PRESALE ||
          eto.subState === EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE);

      if (isNextStateStartDateSet) {
        nextStateStartDate = eto.contract!.startOfStates[nextState];
      }

      return (
        <CampaigningActivatedWidget
          investmentCalculatedValues={eto.investmentCalculatedValues}
          minPledge={eto.minTicketEur}
          etoId={eto.etoId}
          investorsLimit={eto.maxPledges}
          nextState={nextState}
          nextStateStartDate={nextStateStartDate}
          whitelistingIsActive={eto.isBookbuilding}
          canEnableBookbuilding={eto.canEnableBookbuilding}
          keyQuoteFounder={eto.company.keyQuoteFounder}
          isEmbedded={isEmbedded}
        />
      );
    }

    case EETOStateOnChain.Whitelist: {
      if (isEligibleToPreEto) {
        return <InvestmentWidget eto={eto} isEmbedded={isEmbedded} />;
      } else {
        return (
          <CounterWidget
            endDate={eto.contract!.startOfStates[EETOStateOnChain.Public]!}
            awaitedState={EETOStateOnChain.Public}
            etoId={eto.etoId}
          />
        );
      }
    }

    case EETOStateOnChain.Public: {
      return <InvestmentWidget eto={eto} isEmbedded={isEmbedded} />;
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Signing:
    case EETOStateOnChain.Payout: {
      return (
        <ClaimWidget
          etoId={eto.etoId}
          tokenName={eto.equityTokenName || ""}
          totalInvestors={eto.contract!.totalInvestment.totalInvestors}
          totalEquivEur={eto.contract!.totalInvestment.totalEquivEur}
          timedState={timedState}
        />
      );
    }

    case EETOStateOnChain.Refund: {
      return <RefundWidget etoId={eto.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide an implementation.`);
  }
};

export const EtoStatusManager = compose<IStateProps & IExternalProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => ({
      isEligibleToPreEto: investorPortfolioModuleApi.selectors.selectIsEligibleToPreEto(
        state,
        props.eto.etoId,
      ),
      isPreEto:
        etoModuleApi.selectors.selectEtoOnChainStateById(state, props.eto.etoId) ===
        EETOStateOnChain.Whitelist,
      maxCapExceeded: investorPortfolioModuleApi.selectors.selectInitialMaxCapExceeded(
        state,
        props.eto.etoId,
      ),
    }),
  }),
  withContainer(EtoStatusManagerContainer),
)(EtoStatusComponentChooser);
