import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";
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
  selectCompanyData,
  selectEtoData,
  selectIsGeneralEtoLoading,
  selectShouldEtoDataLoad,
} from "../../../modules/eto-flow/selectors";
import { appConnect } from "../../../store";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

export interface IStateProps {
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
  return (
    <>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.companyInformation}
          progress={shouldEtoDataLoad ? companyInformationProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.about" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.legalInformation}
          progress={shouldEtoDataLoad ? legalInformationProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.legal-info" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoTerms}
          progress={shouldEtoDataLoad ? etoTermsProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.eto-terms" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.keyIndividuals}
          progress={shouldEtoDataLoad ? etoKeyIndividualsProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.key-individuals" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.productVision}
          progress={shouldEtoDataLoad ? productVisionProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.product-vision" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoMedia}
          progress={shouldEtoDataLoad ? etoMediaProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.media" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoRiskAssessment}
          progress={shouldEtoDataLoad ? etoRiskAssessmentProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.risk-assessment" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoEquityTokenInfo}
          progress={shouldEtoDataLoad ? etoEquityTokenInfoProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.equity-token-info" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoVotingRight}
          progress={shouldEtoDataLoad ? etoVotingRightProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.voting-right" />}
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoInvestmentTerms}
          progress={shouldEtoDataLoad ? etoInvestmentTermsProgress : 0}
          disabled={!shouldEtoDataLoad}
          name={<FormattedMessage id="eto.form-progress-widget.investment-terms" />}
        />
      </Col>
    </>
  );
};

export const ETOFormsProgressSection = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    loadingData: selectIsGeneralEtoLoading(s),
    shouldEtoDataLoad: selectShouldEtoDataLoad(s),
    companyInformationProgress: calculateCompanyInformationProgress(selectCompanyData(s.etoFlow)),
    etoTermsProgress: calculateEtoTermsProgress(selectEtoData(s.etoFlow)),
    etoKeyIndividualsProgress: calculateEtoKeyIndividualsProgress(selectCompanyData(s.etoFlow)),
    legalInformationProgress: calculateLegalInformationProgress(selectCompanyData(s.etoFlow)),
    productVisionProgress: calculateProductVisionProgress(selectCompanyData(s.etoFlow)),
    etoMediaProgress: calculateEtoMediaProgress(selectCompanyData(s.etoFlow)),
    etoVotingRightProgress: calculateEtoVotingRightProgress(selectEtoData(s.etoFlow)),
    etoEquityTokenInfoProgress: calculateEtoEquityTokenInfoProgress(selectEtoData(s.etoFlow)),
    etoRiskAssessmentProgress: calculateEtoRiskAssessmentProgress(selectCompanyData(s.etoFlow)),
    etoInvestmentTermsProgress: calculateInvestmentTermsProgress(selectEtoData(s.etoFlow)),
  }),
})(ETOFormsProgressSectionComponent);
