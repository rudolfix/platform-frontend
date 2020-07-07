import {
  EKycInstantIdStatus,
  EKycRequestStatus,
  EKycRequestType,
  kycApi,
} from "@neufund/shared-modules";
import * as React from "react";
import { Redirect } from "react-router-dom";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { selectIsUserEmailVerified } from "../../modules/auth/selectors";
import { instantIdApi } from "../../modules/instant-id/module";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/react-connected-components/OnEnterAction";
import { appRoutes } from "../appRoutes";
import { EContentWidth } from "../layouts/Content";
import { FullscreenProgressLayout } from "../layouts/FullscreenProgressLayout";
import { TContentExternalProps } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../shared/hocs/withContainer";

const KycLayout = React.lazy(() => import("./KycLayout").then(imp => ({ default: imp.KycLayout })));

interface IStateProps {
  requestStatus?: EKycRequestStatus;
  instantIdStatus: EKycInstantIdStatus | undefined;
  idNowRedirectUrl: string | undefined;
  requestType: EKycRequestType | undefined;
  hasVerifiedEmail: boolean;
  isKycFlowBlockedByRegion: boolean;
}

interface IDispatchProps {
  goToProfile: () => void;
  goToDashboard: () => void;
}

const Kyc = compose<IStateProps & IDispatchProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      requestStatus: kycApi.selectors.selectKycRequestStatus(state),
      instantIdStatus: kycApi.selectors.selectKycInstantIdStatus(state),
      idNowRedirectUrl: instantIdApi.selectors.selectKycIdNowRedirectUrl(state),
      requestType: kycApi.selectors.selectKycRequestType(state),
      hasVerifiedEmail: selectIsUserEmailVerified(state),
      isKycFlowBlockedByRegion: kycApi.selectors.selectIsKycFlowBlockedByRegion(state),
    }),
    dispatchToProps: dispatch => ({
      goToProfile: () => dispatch(actions.routing.goToProfile()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  branch(
    (props: IStateProps) => !props.hasVerifiedEmail || props.isKycFlowBlockedByRegion,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadStatusAndData());
    },
  }),
  withContainer(
    withProps<TContentExternalProps, {}>({ width: EContentWidth.SMALL })(FullscreenProgressLayout),
  ),
)(KycLayout);

export { Kyc };
