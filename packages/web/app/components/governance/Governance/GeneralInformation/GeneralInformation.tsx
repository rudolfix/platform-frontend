import { DeepReadonlyObject } from "@neufund/shared-utils";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { governanceModuleApi } from "../../../../modules/governance/module";
import { IResolution } from "../../../../modules/governance/types";
import { routingActions } from "../../../../modules/routing/actions";
import { TGovernanceViewState } from "../../../../modules/governance/reducer";
import { appConnect } from "../../../../store";
import { EProcessState } from "../../../../utils/enums/processStates";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import {
  GeneralInformationContainer,
  TGeneralInformationContainerProps,
} from "./GeneralInformationContainer";
import { GeneralInformationContainer } from "./GeneralInformationConainer";
import { GeneralInformationList, TGeneralInformationListProps } from "./GeneralInformationList";
import { GeneralInformationListEmpty } from "./GeneralInformationListEmpty";

type TDispatchProps = {
  openGovernanceUpdateModal: () => void;
  closeGovernanceUpdateModal: () => void;
  publishUpdate: () => void;
  uploadFile: (file: File) => void;
};

export const GeneralInformation = compose<TGeneralInformationListProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<DeepReadonlyObject<TGovernanceViewState>, TDispatchProps>({
    stateToProps: state => ({
      ...governanceModuleApi.selectors.selectGovernanceData(state),
    }),
    dispatchToProps: dispatch => ({
      toggleGovernanceUpdateModal: (show: boolean) =>
        dispatch(actions.governance.toggleGovernanceUpdateModal(show)),
      onUpdatePublish: (title: string) =>
        dispatch(actions.txTransactions.startPublishResolutionUpdate(title)),
      onPageChange: (to: string) => dispatch(routingActions.push(to)),
      openGovernanceUpdateModal: () => dispatch(actions.governance.openGovernanceUpdateModal()),
      closeGovernanceUpdateModal: () => dispatch(actions.governance.closeGovernanceUpdateModal()),
      publishUpdate: () => dispatch(actions.governance.publishUpdate()),
      uploadFile: (file: File) => dispatch(actions.governance.uploadFile(file)),
      removeFile: () => dispatch(actions.governance.removeFile()),
      onFormChange: (formId: string, fieldPath: string, newValue: string) =>
        dispatch(actions.governance.onFormChange(formId, fieldPath, newValue)),
      onFormBlur: (formId: string, fieldPath: string, newValue: string) =>
        dispatch(actions.governance.onFormBlur(formId, fieldPath, newValue)),
    }),
  }),
  branch<TStateProps>(({ files }) => !files, renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TGeneralInformationContainerProps, TGeneralInformationContainerProps>(
      ({ onUpdatePublish, toggleGovernanceUpdateModal, showUpdateModal, onPageChange }) => ({
        toggleGovernanceUpdateModal,
        onUpdatePublish,
        showUpdateModal,
        onPageChange,
      }),
    )(GeneralInformationContainer),
  branch<TGovernanceViewState>(
    ({ processState }) => processState !== EProcessState.SUCCESS,
    renderComponent(LoadingIndicator),
  ),
  withContainer(GeneralInformationContainer),
  branch<TGovernanceViewState>(
    props => props.processState === EProcessState.SUCCESS && props.resolutions.length === 0,
    renderComponent(GeneralInformationListEmpty),
  ),
)(GeneralInformationList);
