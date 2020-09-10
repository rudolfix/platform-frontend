import {
  authModuleAPI,
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
  EETOStateOnChain,
  EKycRequestStatus,
  EOfferingDocumentType,
  etoModuleApi,
  kycApi,
  TEtoWithCompanyAndContractReadonly,
} from "@neufund/shared-modules";
import { RequiredByKeys } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent, withProps } from "recompose";
import { compose } from "redux";

import { selectBackupCodesVerified } from "../../modules/auth/selectors";
import {
  selectAreAgreementsSignedByNominee,
  selectCombinedEtoCompanyData,
  selectIsISHAPreviewSubmitted,
  selectIsMarketingDataVisibleInPreview,
  selectIsOfferingDocumentSubmitted,
  selectIssuerEtoOfferingDocumentType,
  selectIssuerEtoWithCompanyAndContract,
  selectIsTermSheetSubmitted,
  selectPreEtoStartDateFromContract,
  userHasKycAndEmailVerified,
} from "../../modules/eto-flow/selectors";
import {
  calculateEtoInvestmentTermsData,
  calculateEtoTermsData,
  calculateMarketingEtoData,
  calculateVotingRightsEtoData,
} from "../../modules/eto-flow/utils";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { DashboardHeading } from "../shared/DashboardHeading";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import {
  EProjectStatusLayout,
  EProjectStatusSize,
  ETOIssuerState,
} from "../shared/eto-state/ETOState";
import { Heading } from "../shared/Heading";
import { withContainer } from "../shared/hocs/withContainer";
import { LoadingIndicator } from "../shared/loading-indicator";
import { Tooltip } from "../shared/tooltips";
import { BookBuildingWidget } from "./book-building-widget/BookBuildingWidget";
import { ChooseEtoStartDateWidget } from "./choose-eto-start-date-widget/ChooseEtoStartDateWidget";
import { DashboardStep } from "./dashboard-step/DashboardStep";
import { ETOFormsProgressWidget } from "./eto-forms-progress-widget/ETOFormsProgressWidget";
import { ETOFundraisingCounterWidget } from "./ETOFundraisingCounterWidget";
import { ETOFundraisingStatistics } from "./ETOFundraisingStatistics";
import { ETOISHASignCounter } from "./ETOISHASignCounter";
import { PublishETOWidget } from "./PublishETOWidget";
import { UploadInvestmentAgreement } from "./sign-investment-agreement-widget/UploadInvestmentAgreementWidget";
import { SubmitProposalWidget } from "./submit-proposal-widget/SubmitProposalWidget";
import { TokenholdersWidget } from "./tokenholders-widget/TokenholdersWidget";
import { UploadInvestmentMemorandum } from "./UploadInvestmentMemorandum";
import { UploadISHA } from "./UploadISHA";
import { UploadProspectusWidget } from "./UploadProspectusWidget";
import { UploadTermSheetWidget } from "./UploadTermSheetWidget";
import { EEtoStep, selectEtoStep } from "./utils";

import * as styles from "./EtoDashboard.module.scss";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IStateProps {
  verifiedEmail?: string;
  backupCodesVerified: boolean;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: EKycRequestStatus;
  eto?: TEtoWithCompanyAndContractReadonly;
  combinedEtoCompanyData: ReturnType<typeof selectCombinedEtoCompanyData>;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted: boolean | undefined;
  isISHASubmitted: boolean | undefined;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview | undefined;
  areAgreementsSignedByNominee: ReturnType<typeof selectAreAgreementsSignedByNominee>;
  preEtoStartDate: ReturnType<typeof selectPreEtoStartDateFromContract>;
}

interface IComputedProps {
  isVerificationSectionDone: boolean;
  shouldViewEtoSettings: boolean;
  shouldViewSubmissionSection: boolean;
  shouldViewMarketingSubmissionSection: boolean;
  etoStep: EEtoStep | undefined;
}

type TVerificationSection = Omit<
  IStateProps,
  | "combinedEtoCompanyData"
  | "isMarketingDataVisibleInPreview"
  | "areAgreementsSignedByNominee"
  | "preEtoStartDate"
> &
  Omit<RequiredByKeys<IComputedProps, "etoStep">, "isVerificationSectionDone">;

const SubmitDashBoardSection: React.FunctionComponent<{
  isTermSheetSubmitted?: boolean;
  columnSpan?: EColumnSpan;
}> = ({ isTermSheetSubmitted, columnSpan }) =>
  isTermSheetSubmitted ? (
    <SubmitProposalWidget columnSpan={columnSpan} />
  ) : (
    <UploadTermSheetWidget columnSpan={columnSpan} />
  );

interface IEtoStateRender {
  eto: TEtoWithCompanyAndContractReadonly;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  isISHASubmitted: boolean | undefined;
  offeringDocumentType: EOfferingDocumentType | undefined;
  shouldViewEtoSettings: boolean;
  shouldViewMarketingSubmissionSection: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  eto,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  isISHASubmitted,
  offeringDocumentType,
  shouldViewEtoSettings,
  shouldViewMarketingSubmissionSection,
}) => {
  const dashboardTitle = (
    <ETOIssuerState eto={eto} size={EProjectStatusSize.LARGE} layout={EProjectStatusLayout.BLACK} />
  );

  const shouldDisplayStatistics =
    etoModuleApi.utils.isOnChain(eto) &&
    [EETOStateOnChain.Whitelist, EETOStateOnChain.Public].includes(eto.contract.timedState);

  switch (eto.state) {
    case EEtoState.PREVIEW:
      return (
        <>
          {/*Show actions header only if actions are available*/}
          {(shouldViewMarketingSubmissionSection || shouldViewSubmissionSection) && (
            <Container columnSpan={EColumnSpan.THREE_COL}>
              <DashboardHeading title={<FormattedMessage id="eto-dashboard.available-actions" />} />
            </Container>
          )}

          {shouldViewMarketingSubmissionSection && (
            <PublishETOWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          )}

          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection
              isTermSheetSubmitted={isTermSheetSubmitted}
              columnSpan={EColumnSpan.ONE_AND_HALF_COL}
            />
          )}

          <ETOFormsProgressWidget shouldViewEtoSettings={shouldViewEtoSettings} />
        </>
      );
    case EEtoState.PENDING:
    case EEtoState.SUSPENDED:
      return (
        <>
          <ETOFormsProgressWidget shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.LISTED:
      return (
        <>
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />

          {!isOfferingDocumentSubmitted &&
            (offeringDocumentType === EOfferingDocumentType.PROSPECTUS ? (
              <UploadProspectusWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
            ) : (
              <UploadInvestmentMemorandum columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
            ))}

          {isOfferingDocumentSubmitted && !isISHASubmitted && (
            <UploadISHA columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          )}

          <ETOFormsProgressWidget shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ETOFormsProgressWidget shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          {shouldDisplayStatistics && (
            <>
              <ETOFundraisingStatistics eto={eto} columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
              <ETOFundraisingCounterWidget eto={eto} columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
            </>
          )}

          <UploadInvestmentAgreement columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ETOISHASignCounter eto={eto} columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ChooseEtoStartDateWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <TokenholdersWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ETOFormsProgressWidget shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    default:
      return (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading title={dashboardTitle} />
        </Container>
      );
  }
};

const VerificationSection: React.FunctionComponent<TVerificationSection> = ({
  etoStep,
  ...props
}) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
      <DashboardStep etoStep={etoStep} offeringDocumentType={props.offeringDocumentType} />
    </Container>
    <SettingsWidgets isDynamic={true} {...props} columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
  </>
);

const VerifiedUserSection: React.FunctionComponent<TVerificationSection> = ({
  eto,
  etoStep,
  ...rest
}) => {
  if (eto && etoStep) {
    return (
      <>
        <Container columnSpan={EColumnSpan.THREE_COL} className="mb-5">
          <div className={styles.header} data-test-id="eto-issuer-state">
            <Heading level={2} decorator={false} disableTransform={true} inheritFont={true}>
              <FormattedHTMLMessage tagName="span" id="eto-dashboard.header" />
            </Heading>
            {eto && (
              <ETOIssuerState
                eto={eto}
                size={EProjectStatusSize.HUGE}
                layout={EProjectStatusLayout.INHERIT}
                className="ml-3"
              />
            )}
          </div>
          <Tooltip
            content={<FormattedHTMLMessage id="eto-dashboard.tooltip.description" tagName="span" />}
          >
            <FormattedMessage id="eto-dashboard.tooltip" />
          </Tooltip>
        </Container>

        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardStep etoStep={etoStep} offeringDocumentType={rest.offeringDocumentType} />
        </Container>

        <EtoDashboardStateViewComponent eto={eto} {...rest} />
      </>
    );
  } else {
    return (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator />
      </Container>
    );
  }
};

const EtoDashboardLayout: React.FunctionComponent<Omit<
  IStateProps,
  | "combinedEtoCompanyData"
  | "isMarketingDataVisibleInPreview"
  | "areAgreementsSignedByNominee"
  | "preEtoStartDate"
> &
  RequiredByKeys<IComputedProps, "etoStep">> = props => {
  const { isVerificationSectionDone, ...rest } = props;

  return (
    <WidgetGrid data-test-id="eto-dashboard-application">
      {isVerificationSectionDone ? (
        <VerifiedUserSection {...rest} />
      ) : (
        <VerificationSection {...rest} />
      )}
    </WidgetGrid>
  );
};

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps>({
    stateToProps: s => ({
      verifiedEmail: authModuleAPI.selectors.selectVerifiedUserEmail(s),
      backupCodesVerified: selectBackupCodesVerified(s),
      isLightWallet: selectIsLightWallet(s),
      userHasKycAndEmailVerified: userHasKycAndEmailVerified(s),
      requestStatus: kycApi.selectors.selectKycRequestStatus(s),
      eto: selectIssuerEtoWithCompanyAndContract(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s),
      isOfferingDocumentSubmitted: selectIsOfferingDocumentSubmitted(s),
      isISHASubmitted: selectIsISHAPreviewSubmitted(s),
      combinedEtoCompanyData: selectCombinedEtoCompanyData(s),
      offeringDocumentType: selectIssuerEtoOfferingDocumentType(s),
      isMarketingDataVisibleInPreview: selectIsMarketingDataVisibleInPreview(s),
      areAgreementsSignedByNominee: selectAreAgreementsSignedByNominee(s),
      preEtoStartDate: selectPreEtoStartDateFromContract(s),
    }),
  }),
  withContainer(Layout),
  withProps<IComputedProps, IStateProps>(props => {
    const marketingFormsProgress = calculateMarketingEtoData(props.combinedEtoCompanyData);
    const etoTermsFormProgress = calculateEtoTermsData(props.combinedEtoCompanyData);
    const investmentTermsFormProgress = calculateEtoInvestmentTermsData(
      props.combinedEtoCompanyData,
    );
    const etoVotingRightsFormProgress = calculateVotingRightsEtoData(props.combinedEtoCompanyData);

    const shouldViewEtoSettings = marketingFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isInvestmentFilledWithAllRequired =
      investmentTermsFormProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isEtoTermsFilledWithAllRequired = etoTermsFormProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isVotingRightsFilledWithAllRequired =
      etoVotingRightsFormProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isInvestmentAndEtoTermsFilledWithAllRequired =
      isInvestmentFilledWithAllRequired && isEtoTermsFilledWithAllRequired;

    const shouldViewSubmissionSection =
      isInvestmentAndEtoTermsFilledWithAllRequired && isVotingRightsFilledWithAllRequired;

    const isVerificationSectionDone = props.userHasKycAndEmailVerified && props.backupCodesVerified;

    const shouldViewMarketingSubmissionSection =
      shouldViewEtoSettings &&
      !(shouldViewSubmissionSection && props.isTermSheetSubmitted) &&
      props.isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.NOT_VISIBLE;

    const etoStep = props.eto
      ? selectEtoStep({
          isVerificationSectionDone,
          shouldViewEtoSettings,
          isVotingRightsFilledWithAllRequired,
          isEtoTermsFilledWithAllRequired,
          isInvestmentFilledWithAllRequired,
          etoState: props.eto.state,
          etoOnChainState: etoModuleApi.utils.isOnChain(props.eto)
            ? props.eto.contract.timedState
            : undefined,
          isMarketingDataVisibleInPreview: props.isMarketingDataVisibleInPreview,
          isTermSheetSubmitted: props.isTermSheetSubmitted,
          isOfferingDocumentSubmitted: props.isOfferingDocumentSubmitted,
          isISHASubmitted: props.isISHASubmitted,
          isNomineeLinked: !!props.eto.nominee,
          areAgreementsSignedByNominee: props.areAgreementsSignedByNominee,
          preEtoStartDate: props.preEtoStartDate,
        })
      : EEtoStep.VERIFICATION;

    return {
      isVerificationSectionDone,
      shouldViewEtoSettings,
      shouldViewSubmissionSection,
      shouldViewMarketingSubmissionSection,
      etoStep,
    };
  }),
  branch<IComputedProps>(props => props.etoStep === undefined, renderComponent(LoadingIndicator)),
)(EtoDashboardLayout);

export { EtoDashboard, EtoDashboardLayout, EtoDashboardStateViewComponent };
