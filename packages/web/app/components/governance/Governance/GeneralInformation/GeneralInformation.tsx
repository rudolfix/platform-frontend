import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, withProps } from "recompose";

import { TCompanyEtoData } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { actions } from "../../../../modules/actions";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { governanceModuleApi } from "../../../../modules/governance/module";
import { IResolution } from "../../../../modules/governance/types";
import { appConnect } from "../../../../store";
import { Container } from "../../../layouts/Container";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import {
  GeneralInformationContainer,
  TGeneralInformationContainerProps,
} from "./GeneralInformationConainer";
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
    }),
  }),
  branch<TStateProps>(({ files }) => !files, renderComponent(LoadingIndicator)),
  withContainer(
    withProps<TGeneralInformationContainerProps, TGeneralInformationContainerProps>(
      ({ onUpdatePublish, toggleGovernanceUpdateModal, showUpdateModal }) => ({
        toggleGovernanceUpdateModal,
        onUpdatePublish,
        showUpdateModal,
      }),
    )(GeneralInformationContainer),
  ),
  branch<TStateProps>(
    ({ files }) => !!files && files.length === 0,
    renderComponent(GeneralInformationListEmpty),
  ),
)(GeneralInformationList);
