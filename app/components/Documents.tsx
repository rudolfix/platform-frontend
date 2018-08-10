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
    const { loadingData, etoFilesData, generateTemplate, etoFileLoading } = this.props;
    const { etoTemplates, uploadedDocuments } = etoFilesData;

    return (
      <LayoutAuthorized>
        {loadingData || etoFileLoading ? (
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
              </Row>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
                </Col>
                {Object.keys(etoTemplates).map(key => {
                  const typedFileName = etoTemplates[key].name;
                  return (
                    <Col xs={6} lg={3} key={etoTemplates[key].name} className="mb-4">
                      <ETOAddDocuments
                        document={etoTemplates[key]}
                        disabled={
                          false
                          /* uploadedDocuments[typedFileName].status === "canReplace" ? false : true */
                        }
                      >
                        <DocumentTile
                          title={typedFileName}
                          extension={".pdf"}
                          active={
                            true
                            // uploadedDocuments[typedFileName].status === "canReplace" ? true : false
                          }
                          blank={
                            /* uploadedDocuments[typedFileName].url === "" ? true : false */ false
                          }
                        />
                      </ETOAddDocuments>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xs={12} lg={4}>
              <SectionHeader className="my-4" layoutHasDecorator={false} />
              <Row>
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
    }),
    dispatchToProps: dispatch => ({
      downloadImmutableFile: fileId =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId)),
      generateTemplate: document => dispatch(actions.etoFlow.generateTemplate(document)),
    }),
  }),
)(DocumentsComponent);
