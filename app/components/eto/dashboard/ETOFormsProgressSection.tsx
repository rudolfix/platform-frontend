import * as React from "react";
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
import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { getFormFractionDoneCalculator } from "../../../modules/eto-flow/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../../../modules/kyc/selectors";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

export interface IEtoFormsProgressSectionProps {
  loadingData: boolean;
  businessRequestStateLoading: boolean;
  kycStatus?: TRequestStatus;
  isEmailVerified?: boolean;
  companyData: TPartialCompanyEtoData;
  etoData: TPartialEtoSpecData;
}

export const ETOFormsProgressSection: React.SFC<IEtoFormsProgressSectionProps> = ({
  loadingData,
  kycStatus,
  isEmailVerified,
  companyData,
  etoData,
}) => {
  const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;

  const companyInformationProgress = getFormFractionDoneCalculator(
    EtoCompanyInformationType.toYup(),
  )(companyData);
  const etoTermsProgress = getFormFractionDoneCalculator(EtoTermsType.toYup())(etoData);
  const etoKeyIndividualsProgress = getFormFractionDoneCalculator(EtoKeyIndividualsType.toYup())(
    companyData,
  );
  const legalInformationProgress = getFormFractionDoneCalculator(EtoLegalInformationType.toYup())(
    companyData,
  );
  const productVisionProgress = getFormFractionDoneCalculator(EtoProductVisionType.toYup())(
    companyData,
  );
  const etoMediaProgress = getFormFractionDoneCalculator(EtoMediaType.toYup())(companyData);
  const etoRiskAssessmentProgress = getFormFractionDoneCalculator(EtoRiskAssessmentType.toYup())(
    companyData,
  );

  return (
    <>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.companyInformation}
          progress={shouldEtoDataLoad ? companyInformationProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Company Info"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.legalInformation}
          progress={shouldEtoDataLoad ? legalInformationProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Legal Info"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoTerms}
          progress={shouldEtoDataLoad ? etoTermsProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="ETO Terms"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.keyIndividuals}
          progress={shouldEtoDataLoad ? etoKeyIndividualsProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Key Individuals"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.productVision}
          progress={shouldEtoDataLoad ? productVisionProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Product Vision"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoMedia}
          progress={shouldEtoDataLoad ? etoMediaProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Media"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoRiskAssessment}
          progress={shouldEtoDataLoad ? etoRiskAssessmentProgress : 0}
          disabled={!shouldEtoDataLoad}
          name="Risk Assessment"
        />
      </Col>
      {/* TODO: ADD TRANSLATIONS */}
    </>
  );
};
