import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, renderComponent, setDisplayName } from "recompose";
import { compose } from "redux";

import { EEtoState, EtoStateToCamelcase } from "../../lib/api/eto/EtoApi.interfaces";
import {
  EEtoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
} from "../../lib/api/eto/EtoFileApi.interfaces";
import { ignoredTemplates } from "../../lib/api/eto/EtoFileUtils";
import { actions } from "../../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentLoading,
} from "../../modules/eto-documents/selectors";
import {
  selectIssuerEtoDocuments,
  selectIssuerEtoIsRetail,
  selectIssuerEtoLoading,
  selectIssuerEtoState,
  selectIssuerEtoTemplates,
} from "../../modules/eto-flow/selectors";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withMetaTags } from "../../utils/withMetaTags";
import { ETOAddDocuments } from "../eto/shared/EtoAddDocument";
import { EtoFileIpfsModal } from "../eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { ClickableDocumentTile, DocumentTile } from "../shared/Document";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../shared/loading-indicator";
import { SectionHeader } from "../shared/SectionHeader";
import { SingleColDocuments } from "../shared/SingleColDocumentWidget";
import { getDocumentTitles } from "./utils";

import { withContainer } from "../../utils/withContainer";
import * as styles from "./Documents.module.scss";

type IProps = IStateProps & IDispatchProps;

interface IStateProps {
  etoFilesData: IEtoFiles;
  loadingData: boolean;
  etoFileLoading: boolean;
  etoState?: EEtoState;
  etoTemplates: TEtoDocumentTemplates;
  etoDocuments: TEtoDocumentTemplates;
  documentTitles: TDocumentTitles;
  isRetailEto: boolean;
}

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
  downloadDocumentByType: (documentType: EEtoDocumentType) => void;
}

export type TDocumentTitles = { [key in EEtoDocumentType]: TTranslatedString };

export const GeneratedDocuments: React.SFC<{
  document: IEtoDocument;
  generateTemplate: (document: IEtoDocument) => void;
  documentTitle?: TTranslatedString;
}> = ({ document, generateTemplate, documentTitle }) => {
  return (
    <Col xs={6} lg={3} key={"url"} className="mb-4">
      <ClickableDocumentTile
        document={document}
        generateTemplate={generateTemplate}
        title={documentTitle}
        extension={".doc"}
      />
    </Col>
  );
};

const DocumentsLayout: React.SFC<IProps> = ({
  etoFilesData,
  generateTemplate,
  etoState,
  etoTemplates,
  etoDocuments,
  downloadDocumentByType,
  documentTitles,
  isRetailEto,
}) => {
  const { allTemplates, stateInfo } = etoFilesData;
  const generalUploadables = stateInfo ? stateInfo.uploadableDocuments : [];
  return (
    <Row data-test-id="eto-documents">
      <EtoFileIpfsModal />
      <Col xs={12} lg={8}>
        <SectionHeader className="my-4">
          <FormattedMessage id="documents.legal-documents" />
        </SectionHeader>

        <Row>
          <Col xs={12} className={styles.groupName}>
            <FormattedMessage id="documents.generated-documents" />
          </Col>
          {Object.keys(etoTemplates)
            .filter(key => !ignoredTemplates.some(template => template === key))
            .map((key, index) => {
              return (
                <GeneratedDocuments
                  key={index}
                  document={allTemplates[key]}
                  generateTemplate={generateTemplate}
                  documentTitle={documentTitles[allTemplates[key].documentType]}
                />
              );
            })}
          {Object.keys(etoTemplates).length === 0 && (
            <Col className="mb-2">
              <div>
                <FormattedMessage id="documents.please-fill-the-eto-forms-in-order-to-generate-templates" />
              </div>
            </Col>
          )}
        </Row>

        <Row>
          <Col xs={12} className={styles.groupName}>
            <FormattedMessage id="documents.approved-prospectus-and-agreements-to-upload" />
          </Col>
          {generalUploadables.map((key: EEtoDocumentType, index: number) => {
            const typedFileName = documentTitles[key];
            const canUpload =
              stateInfo &&
              etoState &&
              stateInfo.canUploadInStates[EtoStateToCamelcase[etoState]].some(
                (fileName: string) => fileName === key,
              );
            const isFileUploaded = Object.keys(etoDocuments).some(
              uploadedKey => etoDocuments[uploadedKey].documentType === key,
            );
            return (
              <Col xs={6} lg={3} key={index} className="mb-2" data-test-id={`form.name.${key}`}>
                <ETOAddDocuments documentType={key} disabled={!canUpload}>
                  <DocumentTile
                    title={typedFileName}
                    extension={".pdf"}
                    active={canUpload}
                    blank={!isFileUploaded}
                  />
                </ETOAddDocuments>
                {isFileUploaded && (
                  <button
                    data-test-id="documents-download-document"
                    onClick={() => downloadDocumentByType(key)}
                    className={cn(styles.subTitleDownload)}
                  >
                    <FormattedMessage id="documents.download-document" />
                  </button>
                )}
              </Col>
            );
          })}
        </Row>
      </Col>
      <Col xs={12} lg={4}>
        <SectionHeader className="my-4" layoutHasDecorator={false} />
        <Row>
          {allTemplates && (
            <SingleColDocuments
              documents={Object.keys(etoTemplates).map(key => {
                return allTemplates[key];
              })}
              title={<FormattedMessage id="documents.agreement-and-prospectus-templates" />}
              className={styles.documents}
              isRetailEto={isRetailEto}
            />
          )}
        </Row>
      </Col>
    </Row>
  );
};

const Documents = compose<React.SFC>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  setDisplayName("Documents"),
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const isRetailEto = selectIssuerEtoIsRetail(state);
      return {
        etoFilesData: selectEtoDocumentData(state.etoDocuments),
        loadingData: selectIssuerEtoLoading(state),
        etoFileLoading: selectEtoDocumentLoading(state.etoDocuments),
        etoState: selectIssuerEtoState(state),
        etoTemplates: selectIssuerEtoTemplates(state)!,
        etoDocuments: selectIssuerEtoDocuments(state)!,
        documentTitles: getDocumentTitles(isRetailEto),
        isRetailEto,
      };
    },
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      downloadDocumentByType: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentByType(documentType)),
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
  withContainer(LayoutAuthorized),
  branch(
    (props: IProps) => props.loadingData || props.etoFileLoading || !props.etoState,
    renderComponent(LoadingIndicator),
  ),
)(DocumentsLayout);

export { Documents, DocumentsLayout };
