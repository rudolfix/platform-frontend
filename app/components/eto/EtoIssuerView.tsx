import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { selectEtoDocumentData } from "../../modules/eto-documents/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";
import {
  selectIssuerCompany,
  selectIssuerEtoWithCompanyAndContract,
} from "../../modules/eto-flow/selectors";

export const EtoIssuerView = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadIssuerEto());
      dispatch(actions.etoDocuments.loadFileDataStart());
    },
  }),
  appConnect({
    stateToProps: state => ({
      companyData: selectIssuerCompany(state),
      etoData: selectIssuerEtoWithCompanyAndContract(state),
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
    }),
  }),
  withContainer(LayoutAuthorized),
)(EtoPublicComponent);
