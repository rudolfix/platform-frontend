import {
  EEtoDocumentType,
  EEtoState,
  EETOStateOnChain,
  EOfferingDocumentType,
  IEtoDocument,
  IEtoFilesInfo,
  TEtoDocumentTemplates,
} from "@neufund/shared-modules";
import { DeepReadonly, nonNullable } from "@neufund/shared-utils";
import { isEmpty } from "lodash";
import * as React from "react";
import { Redirect } from "react-router-dom";
import { branch, compose, renderComponent, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentsDownloading,
  selectEtoDocumentsUploading,
} from "../../../modules/eto-documents/selectors";
import {
  selectFilteredIssuerEtoTemplatesArray,
  selectIssuerEtoDocuments,
  selectIssuerEtoId,
  selectIssuerEtoOfferingDocumentType,
  selectIssuerEtoOnChainState,
  selectIssuerEtoState,
  userHasKycAndEmailVerified,
} from "../../../modules/eto-flow/selectors";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { selectAreTherePendingTxs } from "../../../modules/tx/monitor/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/react-connected-components/OnEnterAction";
import { withMetaTags } from "../../../utils/withMetaTags";
import { appRoutes } from "../../appRoutes";
import { Layout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { withContainer } from "../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../shared/loading-indicator/index";
import { DocumentsLayout } from "./DocumentsLayout";

type TStateProps = {
  etoState: EEtoState;
  etoTemplates: IEtoDocument[];
  etoDocuments: TEtoDocumentTemplates;
  offeringDocumentType: EOfferingDocumentType;
  onChainState: EETOStateOnChain | undefined;
  documentsDownloading: { [key in EEtoDocumentType]?: boolean };
  documentsUploading: { [key in EEtoDocumentType]?: boolean };
  transactionPending: boolean;
  documentsGenerated: { [ipfsHash: string]: boolean };
};

type TGuardProps = {
  etoId: string | undefined;
  etoFilesData: DeepReadonly<IEtoFilesInfo>;
  verificationIsComplete: boolean;
};

type TDispatchProps = {
  generateTemplate: (document: IEtoDocument) => void;
  startDocumentDownload: (documentType: EEtoDocumentType) => void;
  startDocumentRemove: (documentType: EEtoDocumentType) => void;
  startDocumentUpload: (file: File, documentType: EEtoDocumentType) => void;
};

type TComponentProps = TDispatchProps & {
  etoState: EEtoState;
  etoTemplates: IEtoDocument[];
  etoDocuments: TEtoDocumentTemplates;
  offeringDocumentType: EOfferingDocumentType;
  onChainState: EETOStateOnChain;
  documentsDownloading: { [key in EEtoDocumentType]?: boolean };
  documentsUploading: { [key in EEtoDocumentType]?: boolean };
  transactionPending: boolean;
  documentsGenerated: { [ipfsHash: string]: boolean };
  etoFilesData: DeepReadonly<IEtoFilesInfo>;
};

const Documents = compose<TComponentProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  setDisplayName("Documents"),
  appConnect<TGuardProps>({
    stateToProps: state => ({
      etoId: selectIssuerEtoId(state),
      etoFilesData: selectEtoDocumentData(state.etoDocuments),
      verificationIsComplete: userHasKycAndEmailVerified(state),
    }),
  }),
  branch<TGuardProps>(
    props => !props.verificationIsComplete,
    renderComponent(() => <Redirect to={appRoutes.profile} />),
  ),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  withContainer(Layout),
  branch<TGuardProps>(
    props => !props.etoId || isEmpty(props.etoFilesData.productTemplates),
    renderComponent(LoadingIndicator),
  ),
  appConnect<TStateProps, TDispatchProps, { etoId: string }>({
    stateToProps: state => ({
      etoState: nonNullable(selectIssuerEtoState(state)),
      onChainState: selectIssuerEtoOnChainState(state),
      etoTemplates: selectFilteredIssuerEtoTemplatesArray(state),
      etoDocuments: nonNullable(selectIssuerEtoDocuments(state)),
      documentsDownloading: selectEtoDocumentsDownloading(state.etoDocuments),
      documentsUploading: selectEtoDocumentsUploading(state.etoDocuments),
      transactionPending: selectAreTherePendingTxs(state),
      documentsGenerated: selectPendingDownloads(state),
      offeringDocumentType: nonNullable(selectIssuerEtoOfferingDocumentType(state)),
    }),
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      startDocumentDownload: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentStart(documentType)),
      startDocumentRemove: documentType =>
        dispatch(actions.etoDocuments.etoRemoveDocumentStart(documentType)),
      startDocumentUpload: (file, documentType) =>
        dispatch(
          actions.etoDocuments.showIpfsModal(() =>
            dispatch(actions.etoDocuments.etoUploadDocumentStart(file, documentType)),
          ),
        ),
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
)(DocumentsLayout);

export { Documents, TComponentProps };
