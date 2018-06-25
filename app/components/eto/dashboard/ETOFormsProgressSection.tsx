import * as React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";

import {
  EtoCompanyInformationType,
  EtoProductVisionType,
} from "../../../lib/api/EtoApi.interfaces";
import { TRequestStatus } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserEmailVerified } from "../../../modules/auth/selectors";
import { etoFlowInitialState } from "../../../modules/eto-flow/reducer";
import { selectFormFractionDone } from "../../../modules/eto-flow/selectors";
import { selectKycRequestStatus, selectWidgetLoading } from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { etoRegisterRoutes } from "../registration/routes";

interface IStateProps {
  companyInformationProgress: number;
  productVisionProgress: number;
  loadingData: boolean;
  businessRequestStateLoading: boolean;
  kycStatus?: TRequestStatus;
  isEmailVerified: boolean;
}

interface IDispatchProps {
  loadDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

class ETOFormsProgressSectionWidget extends React.Component<IProps> {
  componentDidUpdate(): void {
    const { kycStatus, isEmailVerified, loadDataStart } = this.props;
    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;
    if (shouldEtoDataLoad) loadDataStart();
  }
  render(): React.ReactNode {
    const {
      companyInformationProgress,
      productVisionProgress,
      kycStatus,
      isEmailVerified,
      loadingData,
    } = this.props;

    const shouldEtoDataLoad = kycStatus === "Accepted" && isEmailVerified;

    return (
      <>
        <Col md={4} className="pt-2">
          <Link to={etoRegisterRoutes.companyInformation}>
            <Button>
              Company Information
              {shouldEtoDataLoad && (
                <>: {loadingData ? <>loading</> : companyInformationProgress}</>
              )}
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
            <Button>
              Product Vision
              {shouldEtoDataLoad && <>: {loadingData ? <>loading</> : productVisionProgress}</>}
            </Button>
          </Link>
        </Col>
        {/* TODO: ADD PROPER LOADING INDICATOR ONCE CONNECTED TO COMPONENTS */}
        {/* TODO: CONNECT ALL FORMS */}
        {/* TODO: ADD TRANSLATIONS */}
      </>
    );
  }
}

export const ETOFormsProgressSection = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      companyInformationProgress: selectFormFractionDone(
        EtoCompanyInformationType.toYup(),
        s.etoFlow.data,
        etoFlowInitialState,
      ),
      productVisionProgress: selectFormFractionDone(
        EtoProductVisionType.toYup(),
        s.etoFlow.data,
        etoFlowInitialState,
      ),
      loadingData: s.etoFlow.loading,
      kycStatus: selectKycRequestStatus(s.kyc),
      isEmailVerified: selectIsUserEmailVerified(s.auth),
      businessRequestStateLoading: selectWidgetLoading(s.kyc),
    }),
    dispatchToProps: dispatch => ({
      loadDataStart: () => dispatch(actions.etoFlow.loadDataStart()),
    }),
  }),
)(ETOFormsProgressSectionWidget);
