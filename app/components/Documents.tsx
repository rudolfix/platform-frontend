import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { IEtoFiles, TEtoUploadFile } from "../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../modules/actions";
import { selectEtoFileData, selectEtoLoadingData } from "../modules/eto-flow/selectors";
import { appConnect } from "../store";
import { ETOAddDocuments } from "./eto/shared/EtoAddDocument";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { DocumentTile } from "./shared/Document";
import { LoadingIndicator } from "./shared/LoadingIndicator";
import { SectionHeader } from "./shared/SectionHeader";
import { SingleColDocumentsWidget } from "./shared/singleColDocumentWidget";

import * as styles from "./Documents.module.scss";

export const GeneratedDocuments: React.SFC<{ title: string; url: string }> = ({ title, url }) => {
  return (
    <Col xs={6} md={3} key={url} className="mb-4">
      <a href={url} target="_blank">
        <DocumentTile title={title} extension={url} />
      </a>
    </Col>
  );
};

class DocumentsComponent extends React.Component<IProps> {
  componentDidMount(): void {
    const { loadFileDataStart } = this.props;
    loadFileDataStart();
  }
  render(): React.ReactNode {
    const { loadingData, etoFilesData } = this.props;
    const { links, generatedDocuments, uploadedDocuments } = etoFilesData;
    return (
      <LayoutAuthorized>
        {loadingData ? (
          <LoadingIndicator />
        ) : (
          <Row>
            <Col xs={12} md={8}>
              <SectionHeader className="my-4">
                <FormattedMessage id="documents.legal-documents" />
              </SectionHeader>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  GENERATED DOCUMENTS
                </Col>
                {generatedDocuments.map(({ title, url }, index) => {
                  return (
                    url && url !== "" && <GeneratedDocuments key={index} {...{ title, url }} />
                  );
                })}
              </Row>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
                </Col>
                {Object.keys(uploadedDocuments).map(fileName => {
                  const typedFileName = fileName as TEtoUploadFile;
                  return (
                    <Col xs={6} md={3} key={fileName} className="mb-4">
                      <ETOAddDocuments
                        fileName={typedFileName}
                        disabled={
                          uploadedDocuments[typedFileName].status === "canReplace" ? false : true
                        }
                      >
                        <DocumentTile
                          title={typedFileName}
                          extension={
                            (uploadedDocuments[typedFileName].file &&
                              uploadedDocuments[typedFileName].file!.name) ||
                            ""
                          }
                          active={
                            uploadedDocuments[typedFileName].status === "canReplace" ? true : false
                          }
                          blank={uploadedDocuments[typedFileName].url === "" ? true : false}
                        />
                      </ETOAddDocuments>
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xs={12} md={4}>
              <SectionHeader className="my-4" layoutHasDecorator={false} />
              <Row>
                <SingleColDocumentsWidget
                  documents={links}
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
}

interface IDispatchProps {
  loadFileDataStart: () => void;
}

export const Documents = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      etoFilesData: selectEtoFileData(s.etoFlow),
      loadingData: selectEtoLoadingData(s.etoFlow),
    }),
    dispatchToProps: dispatch => ({
      loadFileDataStart: () => dispatch(actions.etoFlow.loadFileDataStart()),
    }),
  }),
)(DocumentsComponent);
