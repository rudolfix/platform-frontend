import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";
import {
  EtoCompanyInformationType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMediaType,
  EtoProductVisionType,
  EtoRiskAssessmentType,
  EtoTermsType,
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
} from "../../../lib/api/eto/EtoApi.interfaces";
import { selectKycRequestStatus, selectWidgetLoading } from "../../../modules/kyc/selectors";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

export interface IEtoFormsProgressSectionProps {
  loadingData: boolean;
  shouldEtoDataLoad: boolean;
  companyInformationProgress: number;
  legalInformationProgress: number;
  etoTermsProgress: number;
  etoKeyIndividualsProgress: number;
  productVisionProgress: number;
  etoMediaProgress: number;
  etoRiskAssessmentProgress: number;
}

export const ETOFormsProgressSection: React.SFC<IEtoFormsProgressSectionProps> = ({
  loadingData,
  shouldEtoDataLoad,
  companyInformationProgress,
  legalInformationProgress,
  etoTermsProgress,
  etoKeyIndividualsProgress,
  productVisionProgress,
  etoMediaProgress,
  etoRiskAssessmentProgress,
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
    </>
  );
};
