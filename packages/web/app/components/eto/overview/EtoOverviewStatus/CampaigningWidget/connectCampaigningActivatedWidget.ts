import {
  bookbuildingModuleApi,
  EETOStateOnChain,
  EWhitelistingState,
  IPledge,
  TEtoInvestmentCalculatedValues,
} from "@neufund/shared-modules";
import { compose, setDisplayName, withProps } from "recompose";

import {
  selectIsAuthorized,
  selectIsInvestor,
  selectIsVerifiedInvestor,
} from "../../../../../modules/auth/selectors";
import { appConnect } from "../../../../../store";

interface IExternalProps {
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  investmentCalculatedValues: TEtoInvestmentCalculatedValues | undefined;
  nextState: EETOStateOnChain;
  nextStateStartDate?: Date;
  whitelistingIsActive: boolean;
  keyQuoteFounder: string;
  canEnableBookbuilding: boolean;
  isEmbedded: boolean;
}

interface IStateProps {
  pledgedAmount: number | undefined;
  investorsCount: number | undefined;
  isAuthorized: boolean;
  isInvestor: boolean;
  isVerifiedInvestor: boolean;
  pledge?: IPledge;
}

interface IWithProps {
  whitelistingState: EWhitelistingState;
  countdownDate: Date | undefined;
  maxPledge?: number;
}

type TComponentProps = {
  etoId: string;
  investorsLimit: number;
  minPledge: number;
  investmentCalculatedValues: TEtoInvestmentCalculatedValues | undefined;
  nextState: EETOStateOnChain;
  nextStateStartDate?: Date;
  keyQuoteFounder: string;
  isEmbedded: boolean;
  pledgedAmount: number;
  investorsCount: number;
  isAuthorized: boolean;
  isInvestor: boolean;
  isVerifiedInvestor: boolean;
  pledge?: IPledge;
  whitelistingState: EWhitelistingState;
  countdownDate: Date | undefined;
  maxPledge?: number;
};

const connectCampaigningActivatedWidget = (
  WrappedComponent: React.ComponentType<TComponentProps>,
) =>
  compose<TComponentProps, IExternalProps>(
    setDisplayName("CampaigningActivatedWidget"),
    appConnect<IStateProps, {}, IExternalProps>({
      stateToProps: (state, props) => ({
        isAuthorized: selectIsAuthorized(state),
        isInvestor: selectIsInvestor(state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
        pledgedAmount: bookbuildingModuleApi.selectors.selectPledgedAmount(state, props.etoId),
        investorsCount: bookbuildingModuleApi.selectors.selectInvestorCount(state, props.etoId),
        pledge: bookbuildingModuleApi.selectors.selectMyPledge(state, props.etoId),
      }),
    }),
    withProps<IWithProps, IStateProps & IExternalProps>(
      ({
        nextStateStartDate,
        whitelistingIsActive,
        canEnableBookbuilding,
        investorsLimit,
        investorsCount,
        investmentCalculatedValues,
        isAuthorized,
        isInvestor,
      }) => {
        const bookbuildingLimitReached =
          investorsCount !== undefined ? investorsLimit - investorsCount === 0 : undefined;

        return {
          whitelistingState: bookbuildingModuleApi.utils.calculateWhitelistingState({
            canEnableBookbuilding,
            whitelistingIsActive,
            bookbuildingLimitReached,
            investorsCount,
            investmentCalculatedValues,
            isAuthorized,
            isInvestor,
          }),
          maxPledge: investmentCalculatedValues && investmentCalculatedValues.effectiveMaxTicket,
          countdownDate: nextStateStartDate,
        };
      },
    ),
  )(WrappedComponent);

export { connectCampaigningActivatedWidget, TComponentProps };
