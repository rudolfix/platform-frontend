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
import { selectFormFractionDone } from "../../../modules/eto-flow/selectors";
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
  const companyInformationProgress = selectFormFractionDone(
    EtoCompanyInformationType.toYup(),
    companyData,
  );
  const etoTermsProgress = selectFormFractionDone(EtoTermsType.toYup(), etoData);
  const etoKeyIndividualsProgress = selectFormFractionDone(
    EtoKeyIndividualsType.toYup(),
    companyData,
  );
  const legalInformationProgress = selectFormFractionDone(
    EtoLegalInformationType.toYup(),
    companyData,
  );
  const productVisionProgress = selectFormFractionDone(EtoProductVisionType.toYup(), companyData);
  const etoMediaProgress = selectFormFractionDone(EtoMediaType.toYup(), companyData);
  const etoRiskAssessmentProgress = selectFormFractionDone(
    EtoRiskAssessmentType.toYup(),
    companyData,
  );

  return (
    <>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.companyInformation}
          progress={shouldEtoDataLoad ? companyInformationProgress : 0}
          name="Company Info"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.legalInformation}
          progress={shouldEtoDataLoad ? legalInformationProgress : 0}
          name="Legal Info"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoTerms}
          progress={shouldEtoDataLoad ? etoTermsProgress : 0}
          name="ETO Terms"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.keyIndividuals}
          progress={shouldEtoDataLoad ? etoKeyIndividualsProgress : 0}
          name="Key Individuals"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.productVision}
          progress={shouldEtoDataLoad ? productVisionProgress : 0}
          name="Product Vision"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoMedia}
          progress={shouldEtoDataLoad ? etoMediaProgress : 0}
          name="Media"
        />
      </Col>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.etoRiskAssessment}
          progress={shouldEtoDataLoad ? etoRiskAssessmentProgress : 0}
          name="Risk Assessment"
        />
      </Col>
      {/* TODO: ADD TRANSLATIONS */}
    </>
  );
};
