import * as React from "react";
import { Col } from "reactstrap";
import {
  EtoCompanyInformationType,
  EtoKeyIndividualsType,
  EtoLegalInformationType,
  EtoMediaType,
  EtoProductVisionType,
  EtoTermsType,
} from "../../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { selectKycRequestStatus, selectWidgetLoading } from "../../../modules/kyc/selectors";
import { EtoFormProgressWidget } from "../../shared/EtoFormProgressWidget";
import { etoRegisterRoutes } from "../registration/routes";

interface IProps {
  companyInformationProgress: number;
  productVisionProgress: number;
  legalInformationProgress: number;
  etoKeyIndividualsProgress: number;
  etoTermsProgress: number;
  loadingData: boolean;
  businessRequestStateLoading: boolean;
  kycStatus?: TRequestStatus;
  isEmailVerified: boolean;
}

export const ETOFormsProgressSection: React.SFC<IProps> = ({
  companyInformationProgress,
  productVisionProgress,
  etoTermsProgress,
  loadingData,
  etoKeyIndividualsProgress,
  legalInformationProgress,
  kycStatus,
  isEmailVerified,
}) => {
  const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;

  return (
    <>
      <Col lg={4} xs={12} md={6} className="mb-4">
        <EtoFormProgressWidget
          isLoading={loadingData}
          to={etoRegisterRoutes.companyInformation}
          progress={shouldEtoDataLoad ? companyInformationProgress : 0}
          name="Company Information"
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
          to={etoRegisterRoutes.legalInformation}
          progress={shouldEtoDataLoad ? legalInformationProgress : 0}
          name="Legal Information"
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
          progress={shouldEtoDataLoad ? productVisionProgress : 0}
          name="Media"
        />
      </Col>
      {/* TODO: ADD TRANSLATIONS */}
    </>
  );
};
