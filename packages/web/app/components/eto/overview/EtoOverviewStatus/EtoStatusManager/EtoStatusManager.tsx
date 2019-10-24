import * as React from "react";
import { compose } from "recompose";

import {
  selectEtoOnChainStateById,
  selectEtoWithCompanyAndContract,
  selectInvestorEtoWithCompanyAndContract,
} from "../../../../../modules/eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../../modules/eto/types";
import { isOnChain } from "../../../../../modules/eto/utils";
import {
  selectInitialMaxCapExceeded,
  selectIsEligibleToPreEto,
} from "../../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../../store";
import { DataUnavailableError } from "../../../../../utils/errors";
import { withContainer } from "../../../../../utils/withContainer.unsafe";
import { CampaigningActivatedWidget } from "../CampaigningWidget/CampaigningActivatedWidget";
import { ClaimWidget } from "../ClaimRefundWidget/ClaimWidget";
import { RefundWidget } from "../ClaimRefundWidget/RefundWidget";
import { CounterWidget } from "../CounterWidget";
import { EtoMaxCapExceededWidget } from "../EtoMaxCapExceeded";
import { InvestmentWidget } from "../InvestmentWidget/InvestmentWidget";

import * as styles from "../EtoOverviewStatus.module.scss";
import { selectUserType } from "../../../../../modules/auth/selectors";
import { EUserType } from "../../../../../lib/api/users/interfaces";
import { selectIssuerEtoWithCompanyAndContract } from "../../../../../modules/eto-flow/selectors";

interface IExternalProps {
  previewCode: string;
  isEmbedded: boolean;
}

interface IStateProps {
  eto: TEtoWithCompanyAndContract;
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
  const timedState = isOnChain(eto) ? eto.contract.timedState : EETOStateOnChain.Setup;
  const isEtoActive =
    (isEligibleToPreEto && timedState === EETOStateOnChain.Whitelist) ||
    timedState === EETOStateOnChain.Public;

  if (maxCapExceeded && isEtoActive) {
    return <EtoMaxCapExceededWidget eto={eto} />;
  }

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
      const nextStateStartDate = eto.contract ? eto.contract.startOfStates[nextState] : undefined;

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
          totalEquivEurUlps={eto.contract!.totalInvestment.totalEquivEurUlps}
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

// const selectEtoWithCompanyAndContract

export const EtoStatusManager = compose<IStateProps & IExternalProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const userType = selectUserType(state)
      const eto = userType && selectEtoWithCompanyAndContract({
        userType,
        state,
        // previewCode: props.previewCode
      });
      console.log("EtoStatusManager",eto, userType)
      if (eto) {
        return {
          eto,
          isEligibleToPreEto: selectIsEligibleToPreEto(state, eto.etoId),
          isPreEto: selectEtoOnChainStateById(state, eto.etoId) === EETOStateOnChain.Whitelist,
          maxCapExceeded: selectInitialMaxCapExceeded(state, eto.etoId),
        };
      } else {
        throw new DataUnavailableError("eto cannot be undefined at this point");
      }
    },
  }),
  withContainer(EtoStatusManagerContainer),
)(EtoStatusComponentChooser);
