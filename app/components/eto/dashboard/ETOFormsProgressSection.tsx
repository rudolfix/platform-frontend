import * as React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";

import { EtoCompanyInformationType } from "../../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import { etoFlowInitialState } from "../../../modules/eto-flow/reducer";
import { selectFormFractionDone } from "../../../modules/eto-flow/selectors";
import { selectKycRequestStatus } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { etoRegisterRoutes } from "../registration/routes";

interface IStateProps {
  companyInformationProgress: number;
  loadingData: boolean;
  kycStatus?: TRequestStatus;
  isEmailVerified: boolean;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

const ETOFormsProgressSectionWidget: React.SFC<IProps> = ({
  companyInformationProgress,
  loadDataStart,
  kycStatus,
  isEmailVerified,
  loadingData,
}) => {
  if (kycStatus === "Accepted" && isEmailVerified) loadDataStart();
  return (
    <>
      <Col md={4} className="pt-2">
        <Link to={etoRegisterRoutes.companyInformation}>
          <Button>
            {/* TODO: ADD PROPER LOADING INDICATOR ONCE CONNECTED TO COMPONENTS */}
            Company Information: {loadingData ? <>loading</> : companyInformationProgress}
          </Button>
        </Link>
      </Col>
      <Col md={4} className="pt-2">
        <Link to={etoRegisterRoutes.etoTerms}>
          <Button>ETO TERMS</Button>
        </Link>
      </Col>
      <Col md={4} className="pt-2">
        <Link to={etoRegisterRoutes.keyIndividuals}>
          <Button>Key individuals</Button>
        </Link>
      </Col>
      <Col md={4} className="pt-2">
        <Link to={etoRegisterRoutes.legalInformation}>
          <Button>Legal information</Button>
        </Link>
      </Col>
      <Col md={4} className="pt-2">
        <Link to={etoRegisterRoutes.productVision}>
          <Button>Product Vision</Button>
        </Link>
      </Col>
      {/* TODO: CONNECT ALL FORMS */}
      {/* TODO: ADD TRANSLATIONS */}
    </>
  );
};

export const ETOFormsProgressSection = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      companyInformationProgress: selectFormFractionDone(
        EtoCompanyInformationType.toYup(),
        s.etoFlow.data,
        etoFlowInitialState,
      ),
      loadingData: s.etoFlow.loading,
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
    }),
    dispatchToProps: dispatch => ({
      loadDataStart: () => dispatch(actions.etoFlow.loadDataStart()),
    }),
  }),
)(ETOFormsProgressSectionWidget);
