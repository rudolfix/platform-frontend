import * as React from "react";
import { branch, renderComponent } from "recompose";
import { compose } from "redux";

import { TCompanyEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../modules/actions";
import { selectEtoDocumentData } from "../../modules/eto-documents/selectors";
import {
  selectIssuerCompany,
  selectIssuerEtoWithCompanyAndContract,
} from "../../modules/eto-flow/selectors";
import { TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { EtoView } from "./shared/EtoView";

type TStateProps = {
  companyData?: TCompanyEtoData;
  etoData?: TEtoWithCompanyAndContract;
  etoFilesData: IEtoFiles;
};

export const EtoIssuerView = compose<React.SFC>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadIssuerEto());
      dispatch(actions.etoDocuments.loadFileDataStart());
    },
  }),
  appConnect<TStateProps>({
    stateToProps: state => ({
      companyData: selectIssuerCompany(state),
      etoData: selectIssuerEtoWithCompanyAndContract(state),
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
    }),
  }),
  withContainer(LayoutAuthorized),
  branch<TStateProps>(
    props => !props.companyData || !props.etoData,
    renderComponent(LoadingIndicator),
  ),
)(EtoView);
