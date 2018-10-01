import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col } from "reactstrap";

import { EtoState } from "../../../lib/api/eto/EtoApi.interfaces";
import {
  selectIsGeneralEtoLoading,
  selectIssuerCompany,
  selectIssuerEto,
  selectIssuerEtoState,
  selectShouldEtoDataLoad,
} from "../../../modules/eto-flow/selectors";
import {
  calculateCompanyInformationProgress,
  calculateEtoEquityTokenInfoProgress,
  calculateEtoKeyIndividualsProgress,
  calculateEtoMediaProgress,
  calculateEtoRiskAssessmentProgress,
  calculateEtoTermsProgress,
  calculateEtoVotingRightProgress,
  calculateInvestmentTermsProgress,
  calculateLegalInformationProgress,
  calculateProductVisionProgress,
} from "../../../modules/eto-flow/utils";
import { appConnect } from "../../../store";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

export interface IStateProps {
  etoStatus?: EtoState;
  loadingData: boolean;
  shouldEtoDataLoad: boolean;
  companyInformationProgress: number;
  legalInformationProgress: number;
  etoTermsProgress: number;
  etoKeyIndividualsProgress: number;
  productVisionProgress: number;
  etoMediaProgress: number;
  etoRiskAssessmentProgress: number;
  etoEquityTokenInfoProgress: number;
  etoVotingRightProgress: number;
  etoInvestmentTermsProgress: number;
}

const ETOFormsProgressSectionComponent: React.SFC<IStateProps> = ({
  etoStatus,
  loadingData,
  shouldEtoDataLoad,
  companyInformationProgress,
  legalInformationProgress,
  etoTermsProgress,
  etoKeyIndividualsProgress,
  productVisionProgress,
  etoMediaProgress,
  etoRiskAssessmentProgress,
  etoEquityTokenInfoProgress,
  etoVotingRightProgress,
  etoInvestmentTermsProgress,
}) => {
  const sections = [
    {
      redirectTo: etoRegisterRoutes.companyInformation,
      progress: companyInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.about" />,
      readonly: false,
    },
    {
      redirectTo: etoRegisterRoutes.legalInformation,
      progress: legalInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.legal-info" />,
      readonly: etoStatus !== EtoState.PREVIEW,
    },
    {
      redirectTo: etoRegisterRoutes.etoInvestmentTerms,
      progress: etoInvestmentTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.investment-terms" />,
      readonly: etoStatus !== EtoState.PREVIEW,
    },
    {
      redirectTo: etoRegisterRoutes.etoTerms,
      progress: etoTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-terms" />,
      readonly: etoStatus !== EtoState.PREVIEW,
    },
    {
      redirectTo: etoRegisterRoutes.keyIndividuals,
      progress: etoKeyIndividualsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.key-individuals" />,
      readonly: false,
    },
    {
      redirectTo: etoRegisterRoutes.productVision,
      progress: productVisionProgress,
      name: <FormattedMessage id="eto.form-progress-widget.product-vision" />,
      readonly: false,
    },
    {
      redirectTo: etoRegisterRoutes.etoMedia,
      progress: etoMediaProgress,
      name: <FormattedMessage id="eto.form-progress-widget.media" />,
      readonly: false,
    },
    {
      redirectTo: etoRegisterRoutes.etoRiskAssessment,
      progress: etoRiskAssessmentProgress,
      name: <FormattedMessage id="eto.form-progress-widget.risk-assessment" />,
      readonly: false,
    },
    {
      redirectTo: etoRegisterRoutes.etoEquityTokenInfo,
      progress: etoEquityTokenInfoProgress,
      name: <FormattedMessage id="eto.form-progress-widget.equity-token-info" />,
      readonly: etoStatus !== EtoState.PREVIEW,
    },
    {
      redirectTo: etoRegisterRoutes.etoVotingRight,
      progress: etoVotingRightProgress,
      name: <FormattedMessage id="eto.form-progress-widget.voting-right" />,
      readonly: etoStatus !== EtoState.PREVIEW,
    },
  ];

  return (
    <>
      {sections.map((section, index) => (
        <Col key={index} lg={4} xs={12} md={6} className="mb-4">
          <EtoFormProgressWidget
            isLoading={loadingData}
            to={section.redirectTo}
            progress={shouldEtoDataLoad ? section.progress : 0}
            disabled={!shouldEtoDataLoad}
            readonly={section.readonly}
            name={section.name}
          />
        </Col>
      ))}
    </>
  );
};

export const ETOFormsProgressSection = appConnect<IStateProps, {}>({
  stateToProps: state => ({
    etoStatus: selectIssuerEtoState(state),
    loadingData: selectIsGeneralEtoLoading(state),
    shouldEtoDataLoad: selectShouldEtoDataLoad(state),
    companyInformationProgress: calculateCompanyInformationProgress(selectIssuerCompany(state)),
    etoTermsProgress: calculateEtoTermsProgress(selectIssuerEto(state)),
    etoKeyIndividualsProgress: calculateEtoKeyIndividualsProgress(selectIssuerCompany(state)),
    legalInformationProgress: calculateLegalInformationProgress(selectIssuerCompany(state)),
    productVisionProgress: calculateProductVisionProgress(selectIssuerCompany(state)),
    etoMediaProgress: calculateEtoMediaProgress(selectIssuerCompany(state)),
    etoVotingRightProgress: calculateEtoVotingRightProgress(selectIssuerEto(state)),
    etoEquityTokenInfoProgress: calculateEtoEquityTokenInfoProgress(selectIssuerEto(state)),
    etoRiskAssessmentProgress: calculateEtoRiskAssessmentProgress(selectIssuerCompany(state)),
    etoInvestmentTermsProgress: calculateInvestmentTermsProgress(selectIssuerEto(state)),
  }),
})(ETOFormsProgressSectionComponent);
