import {
  EKycInstantIdStatus,
  EKycRequestStatus,
  EKycRequestType,
  kycApi,
} from "@neufund/shared-modules";
import * as React from "react";
import { branch, compose, renderNothing } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
} from "../../../modules/auth/selectors";
import { instantIdApi } from "../../../modules/instant-id/module";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { onLeaveAction } from "../../../utils/react-connected-components/OnLeaveAction";

interface IStateProps {
  kycRequestType: EKycRequestType | undefined;
  requestStatus: EKycRequestStatus | undefined;
  instantIdStatus: EKycInstantIdStatus | undefined;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  isKycFlowBlockedByRegion: boolean;
  backupCodesVerified: boolean;
  error: string | undefined;
}

interface IDispatchProps {
  onGoToDashboard: () => void;
  onGoToKycHome: () => void;
  onStartIdNow: () => void;
}

const connectKycStatusWidget = () => (
  WrappedComponent: React.ComponentType<IStateProps & IDispatchProps>,
) =>
  compose<IStateProps & IDispatchProps, {}>(
    appConnect<IStateProps, IDispatchProps>({
      stateToProps: state => ({
        isUserEmailVerified: selectIsUserEmailVerified(state),
        backupCodesVerified: selectBackupCodesVerified(state),
        requestStatus: kycApi.selectors.selectKycRequestStatus(state),
        instantIdStatus: kycApi.selectors.selectKycInstantIdStatus(state),
        isLoading: kycApi.selectors.selectKycIsInitialLoading(state),
        isKycFlowBlockedByRegion: kycApi.selectors.selectIsKycFlowBlockedByRegion(state),
        error: kycApi.selectors.selectWidgetError(state.kyc),
        kycRequestType: kycApi.selectors.selectKycRequestType(state),
      }),
      dispatchToProps: dispatch => ({
        onGoToDashboard: () => dispatch(actions.routing.goToDashboard()),
        onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
        onStartIdNow: () => dispatch(instantIdApi.actions.startIdNowRequest()),
      }),
    }),
    branch<IStateProps>(props => props.isLoading, renderNothing),
    onEnterAction({
      actionCreator: d => d(actions.kyc.kycStartWatching()),
    }),
    onLeaveAction({
      actionCreator: d => d(actions.kyc.kycStopWatching()),
    }),
  )(WrappedComponent);

export { connectKycStatusWidget };
