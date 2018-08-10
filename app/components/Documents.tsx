import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { IEtoDocument, IEtoFiles, TEtoUploadFile } from "../lib/api/eto/EtoFileApi.interfaces";
import { immutableDocumentName, ImmutableFileId } from "../lib/api/ImmutableStorage.interfaces";
import { actions } from "../modules/actions";
import {
  selectDocumentTemplates,
  selectEtoFileData,
  selectEtoLoading,
  selectEtoLoadingFile,
} from "../modules/eto-flow/selectors";
import { appConnect } from "../store";
import { onEnterAction } from "../utils/OnEnterAction";
import { ETOAddDocuments } from "./eto/shared/EtoAddDocument";
import { EtoFileIpfsModal } from "./eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { DocumentTile } from "./shared/Document";
import { LoadingIndicator } from "./shared/LoadingIndicator";
import { SectionHeader } from "./shared/SectionHeader";
import { SingleColDocuments } from "./shared/singleColDocumentWidget";

import * as styles from "./Documents.module.scss";
import { selectCurrentEtoState } from "../modules/eto-flow/selectors";
import { IEtoState } from "../modules/eto/reducer";
import { EtoState } from "../lib/api/eto/EtoApi.interfaces";
import { camelCase } from "lodash";

export const GeneratedDocuments: React.SFC<{
  document: IEtoDocument;
  generateTemplate: (document: IEtoDocument) => void;
}> = ({ document, generateTemplate }) => {
  return (
    <Col xs={6} lg={3} key={"url"} className="mb-4">
      <div
        onClick={() => {
          generateTemplate(document);
        }}
      >
        <DocumentTile title={immutableDocumentName[document.name]} extension={".pdf"} />
      </div>
    </Col>
  );
};

class DocumentsComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    const { loadingData, etoFilesData, generateTemplate, etoFileLoading, etoState } = this.props;
    const { etoTemplates, uploadedDocuments, stateInfo } = etoFilesData;
    return (
      <LayoutAuthorized>
        {loadingData || etoFileLoading || !etoState ? (
          <LoadingIndicator />
        ) : (
          <Row>
            <EtoFileIpfsModal />
            <Col xs={12} lg={8}>
              <SectionHeader className="my-4">
                <FormattedMessage id="documents.legal-documents" />
              </SectionHeader>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  GENERATED DOCUMENTS
                </Col>
                {Object.keys(etoTemplates).map((key, index) => {
                  return (
                    <GeneratedDocuments
                      key={index}
                      document={etoTemplates[key]}
                      generateTemplate={generateTemplate}
                    />
                  );
                })}
                {!!(Object.keys(etoTemplates).length === 0) && <div className="mb-2">No files</div>}
              </Row>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
                </Col>
                {Object.keys(etoTemplates).map(key => {
                  const typedFileName = etoTemplates[key].name;
                  const isFileUploaded =
                    stateInfo &&
                    stateInfo.canUploadInStates[etoState].some(
                      fileName => camelCase(fileName) === key,
                    );
                  return (
                    <Col xs={6} lg={3} key={etoTemplates[key].name} className="mb-2">
                      <ETOAddDocuments document={etoTemplates[key]} disabled={!isFileUploaded}>
                        <DocumentTile
                          title={typedFileName}
                          extension={".pdf"}
                          active={isFileUploaded}
                          blank={
                            !Object.keys(uploadedDocuments).some(
                              uploadedKey =>
                                camelCase(uploadedDocuments[uploadedKey].documentType) === key,
                            )
                          }
                        />
                      </ETOAddDocuments>
                    </Col>
                  );
                })}
                {!!(Object.keys(etoTemplates).length === 0) && <div className="mb-4">No files</div>}
              </Row>
            </Col>
            <Col xs={12} lg={4}>
              <SectionHeader className="my-4" layoutHasDecorator={false} />
              <Row>
                {/* TODO: CONNECT WITH TEMPLATES */}
                <SingleColDocuments
                  documents={Object.keys(etoTemplates).map(key => etoTemplates[key])}
                  name="AGREEMENT AND PROSPECTUS TEMPLATES"
                  className={styles.documents}
                />
              </Row>
            </Col>
          </Row>
        )}
      </LayoutAuthorized>
    );
  }
}

type IProps = IStateProps & IDispatchProps;

interface IStateProps {
  etoFilesData: IEtoFiles;
  loadingData: boolean;
  etoFileLoading: boolean;
  etoState?: EtoState;
}

interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId) => void;
  generateTemplate: (document: IEtoDocument) => void;
}

export const Documents = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      etoFilesData: selectEtoFileData(s.etoFlow),
      loadingData: selectEtoLoading(s.etoFlow),
      etoFileLoading: selectEtoLoadingFile(s.etoFlow),
      etoState: selectCurrentEtoState(s.etoFlow),
    }),
    dispatchToProps: dispatch => ({
      downloadImmutableFile: fileId =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId)),
      generateTemplate: document => dispatch(actions.etoFlow.generateTemplate(document)),
    }),
  }),
)(DocumentsComponent);
