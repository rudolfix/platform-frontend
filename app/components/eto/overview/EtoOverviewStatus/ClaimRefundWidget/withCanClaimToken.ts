import { compose, withProps } from "recompose";

import { EUserType } from "../../../../../lib/api/users/interfaces";
import { actions } from "../../../../../modules/actions";
import { selectUserType } from "../../../../../modules/auth/selectors";
import { selectHasInvestorTicket } from "../../../../../modules/investor-tickets/selectors";
import { EETOStateOnChain } from "../../../../../modules/public-etos/types";
import { appConnect } from "../../../../../store";
import { Omit } from "../../../../../types";

interface IExternalProps {
  etoId: string;
  timedState: EETOStateOnChain;
}

interface IStateProps {
  doesInvestorInvest: boolean;
  userType: EUserType | undefined;
}

interface IDispatchProps {
  onClaim: (etoId: string) => void;
}
interface IWithProps {
  canClaimToken: boolean;
  onClaim: (etoId: string) => void;
}

export const withCanClaimToken = <T extends IWithProps>(wrapper: React.ComponentType<T>) =>
  compose<T, IExternalProps & Omit<T, IWithProps>>(
    appConnect<IStateProps, IDispatchProps, IExternalProps>({
      stateToProps: (state, props) => ({
        doesInvestorInvest: selectHasInvestorTicket(state, props.etoId),
        userType: selectUserType(state),
      }),
      dispatchToProps: dispatch => ({
        onClaim: (etoId: string) => dispatch(actions.txTransactions.startUserClaim(etoId)),
      }),
    }),
    withProps<IWithProps, IExternalProps & IStateProps & IDispatchProps>(props => ({
      canClaimToken:
        [EETOStateOnChain.Claim, EETOStateOnChain.Refund].includes(props.timedState) &&
        props.userType === EUserType.INVESTOR &&
        props.doesInvestorInvest,
      onClaim: props.onClaim,
    })),
  )(wrapper);
