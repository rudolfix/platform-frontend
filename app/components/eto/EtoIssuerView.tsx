import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { selectEtoDocumentData } from "../../modules/eto-documents/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { EtoPublicComponent } from "./shared/EtoPublicComponent";

export const EtoIssuerView = compose<React.SFC>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.etoFlow.loadDataStart());
      dispatch(actions.etoDocuments.loadFileDataStart());
    },
  }),
  appConnect({
    stateToProps: s => ({
      companyData: s.etoFlow.companyData,
      etoData: s.etoFlow.etoData,
      etoFilesData: selectEtoDocumentData(s.etoDocuments),
    }),
  }),
  withContainer(LayoutAuthorized),
)(EtoPublicComponent);
