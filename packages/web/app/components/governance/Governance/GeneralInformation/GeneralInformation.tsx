import { TCompanyEtoData } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, withProps } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { governanceModuleApi } from "../../../../modules/governance/module";
import { IResolution } from "../../../../modules/governance/types";
import { routingActions } from "../../../../modules/routing/actions";
import { appConnect } from "../../../../store";
import { Container } from "../../../layouts/Container";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import {
  GeneralInformationContainer,
  TGeneralInformationContainerProps,
} from "./GeneralInformationContainer";
import { GeneralInformationList, TGeneralInformationListProps } from "./GeneralInformationList";

import styles from "./GeneralInformation.module.scss";

const GeneralInformationListEmpty: React.FunctionComponent = () => (
  <Container>
    <ul className={styles.fileList}>
      <div className={styles.emptyMessage}>
        <h5 className={styles.emptyMessageText}>
          <FormattedMessage id="governance.no-updates" />
        </h5>
      </div>
    </ul>
  </Container>
);

type TStateProps = {
  files: ReadonlyArray<IResolution> | undefined;
  company: TCompanyEtoData | undefined;
  showUpdateModal: boolean;
};
type TDispatchProps = Omit<TGeneralInformationContainerProps, "showUpdateModal">;

export const GeneralInformation = compose<TGeneralInformationListProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      files: governanceModuleApi.selectors.selectGovernanceResolutions(state),
      company: selectIssuerCompany(state),
      showUpdateModal: governanceModuleApi.selectors.showGovernanceUpdateModal(state),
    }),
    dispatchToProps: dispatch => ({
      toggleGovernanceUpdateModal: (show: boolean) =>
        dispatch(actions.governance.toggleGovernanceUpdateModal(show)),
      onUpdatePublish: (title: string) =>
        dispatch(actions.txTransactions.startPublishResolutionUpdate(title)),
      onPageChange: (to: string) => dispatch(routingActions.push(to)),
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
  ),
  branch<TStateProps>(
    ({ files }) => !!files && files.length === 0,
    renderComponent(GeneralInformationListEmpty),
  ),
)(GeneralInformationList);
