import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { governanceModuleApi } from "../../../../modules/governance/module";
import { appConnect } from "../../../../store";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { GeneralInformationContainer, } from "./GeneralInformationConainer";
import { GeneralInformationList, TGeneralInformationListProps } from "./GeneralInformationList";
import { GeneralInformationListEmpty } from "./GeneralInformationListEmpty";

import { TGovernanceViewState } from "../../../../modules/governance/reducer";
import { EProcessState } from "../../../../utils/enums/processStates";
import { DeepReadonlyObject } from "@neufund/shared-utils";

type TDispatchProps = {
  openGovernanceUpdateModal: ()=> void;
  closeGovernanceUpdateModal: ()=> void;
  publish: (title: string)=> void;
  uploadFile: (file: string) =>void;
}

export const GeneralInformation = compose<TGeneralInformationListProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<DeepReadonlyObject<TGovernanceViewState>, TDispatchProps>({
    stateToProps: state => ({
      ...governanceModuleApi.selectors.selectGovernanceData(state),
    }),
    dispatchToProps: dispatch => ({
      openGovernanceUpdateModal: () =>
        dispatch(actions.governance.openGovernanceUpdateModal()),
      closeGovernanceUpdateModal: () =>
        dispatch(actions.governance.closeGovernanceUpdateModal()),
      publish: (title: string) =>
        dispatch(actions.txTransactions.startPublishResolutionUpdate(title)),
      uploadFile: (file: string) =>
        dispatch(actions.governance.uploadFile(file)),
      updateForm: (formId: string, fieldPath:string,newValue:string) =>
        dispatch(actions.governance.onFormChange(formId, fieldPath,newValue)),
    }),
  }),
  branch<TGovernanceViewState>(({ processState }) => processState !== EProcessState.SUCCESS, renderComponent(LoadingIndicator)), // fixme add error state
  withContainer(
      GeneralInformationContainer
  ),
  branch<TGovernanceViewState>(
    props => props.processState === EProcessState.SUCCESS && props.resolutions.length === 0,
    renderComponent(GeneralInformationListEmpty),
  ),
)(GeneralInformationList);
