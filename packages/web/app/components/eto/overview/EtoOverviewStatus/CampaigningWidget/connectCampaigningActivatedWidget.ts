import { compose, setDisplayName, withProps } from "recompose";

import { TEtoInvestmentCalculatedValues } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IPledge } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import { actions } from "../../../../../modules/actions";
import {
  selectIsAuthorized,
  selectIsInvestor,
  selectIsVerifiedInvestor,
} from "../../../../../modules/auth/selectors";
import {
  selectInvestorCount,
  selectMyPledge,
  selectPledgedAmount,
} from "../../../../../modules/bookbuilding-flow/selectors";
import {
  calculateWhitelistingState,
  EWhitelistingState,
} from "../../../../../modules/bookbuilding-flow/utils";
import { EETOStateOnChain } from "../../../../../modules/eto/types";
import { appConnect } from "../../../../../store";
import { onEnterAction } from "../../../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../../../utils/OnLeaveAction";

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
        isAuthorized: selectIsAuthorized(state.auth),
        isInvestor: selectIsInvestor(state),
        isVerifiedInvestor: selectIsVerifiedInvestor(state),
        pledgedAmount: selectPledgedAmount(state, props.etoId),
        investorsCount: selectInvestorCount(state, props.etoId),
        pledge: selectMyPledge(state, props.etoId),
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
      }) => {
        const bookbuildingLimitReached =
          investorsCount !== undefined && investorsLimit - investorsCount === 0;
        return {
          whitelistingState: calculateWhitelistingState({
            canEnableBookbuilding,
            whitelistingIsActive,
            bookbuildingLimitReached,
            investorsCount,
            investmentCalculatedValues,
          }),
          maxPledge: investmentCalculatedValues && investmentCalculatedValues.effectiveMaxTicket,
          countdownDate: nextStateStartDate,
        };
      },
    ),
    onEnterAction<IStateProps & IExternalProps & IWithProps>({
      actionCreator: (dispatch, props) => {
        if (props.whitelistingState === EWhitelistingState.ACTIVE) {
          dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
        } else if (props.whitelistingState === EWhitelistingState.LOADING) {
          dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
        }
      },
    }),
    onLeaveAction<IStateProps & IExternalProps & IWithProps>({
      actionCreator: (dispatch, props) => {
        if (props.whitelistingState === EWhitelistingState.ACTIVE) {
          dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
        }
      },
    }),
    // branch<IWithProps & IExternalProps & IStateProps>(
    //   ({ whitelistingState }) =>
    //     whitelistingState === EWhitelistingState.LOADING,
    //   renderComponent(LoadingIndicator),
    // ),
  )(WrappedComponent);

export { connectCampaigningActivatedWidget, TComponentProps };
