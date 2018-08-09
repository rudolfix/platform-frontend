import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { IEtoFiles, TEtoUploadFile } from "../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../lib/api/ImmutableStorage.interfaces";
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

export const GeneratedDocuments: React.SFC<{ title: string; url: string }> = ({ title, url }) => {
  return (
    <Col xs={6} lg={3} key={url} className="mb-4">
      <a href={url} target="_blank">
        <DocumentTile title={title} extension={url} />
      </a>
    </Col>
  );
};

class DocumentsComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    const {
      loadingData,
      etoFilesData,
      etoDocumentTemplates,
      etoFileLoading,
    } = this.props;
    const { generatedDocuments, uploadedDocuments } = etoFilesData;

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
                {/*  {generatedDocuments.map(({ title, url }, index) => {
                  return (
                    url && url !== "" && <GeneratedDocuments key={index} {...{ title, url }} />
                  );
                })} */}
              </Row>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
                </Col>
                {Object.keys(uploadedDocuments).map(fileName => {
                  const typedFileName = fileName as TEtoUploadFile;
                  return (
                    <Col xs={6} lg={3} key={fileName} className="mb-4">
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
            <Col xs={12} lg={4}>
              <SectionHeader className="my-4" layoutHasDecorator={false} />
              <Row>
                <SingleColDocuments
                  documents={Object.keys(etoDocumentTemplates).map(
                    key => etoDocumentTemplates[key],
                  )}
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
  etoDocumentTemplates: any;
  // TODO: remove any
}

interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId) => void;
}

export const Documents = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.etoFlow.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      etoFilesData: selectEtoFileData(s.etoFlow),
      etoDocumentTemplates: selectDocumentTemplates(s.etoFlow),
      loadingData: selectEtoLoading(s.etoFlow),
      etoFileLoading: selectEtoLoadingFile(s.etoFlow),
    }),
    dispatchToProps: dispatch => ({
      downloadImmutableFile: fileId =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId)),
    }),
  }),
)(DocumentsComponent);
