import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoState, EtoStateEnum } from "../lib/api/eto/EtoApi.interfaces";
import {
  etoDocumentType,
  IEtoDocument,
  IEtoFiles,
  TEtoDocumentTemplates,
} from "../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../modules/actions";
import {
  selectEtoDocumentData,
  selectEtoDocumentLoading,
} from "../modules/eto-documents/selectors";
import {
  selectCurrentEtoState,
  selectCurrentEtoTemplates,
  selectEtoLoading,
} from "../modules/eto-flow/selectors";
import { appConnect } from "../store";
import { DeepPartial } from "../types";
import { onEnterAction } from "../utils/OnEnterAction";
import { ETOAddDocuments } from "./eto/shared/EtoAddDocument";
import { EtoFileIpfsModal } from "./eto/shared/EtoFileIpfsModal";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { DocumentTile } from "./shared/Document";
import { LoadingIndicator } from "./shared/LoadingIndicator";
import { SectionHeader } from "./shared/SectionHeader";
import { SingleColDocuments } from "./shared/singleColDocumentWidget";

import * as styles from "./Documents.module.scss";

export const immutableDocumentTitle: { [key: string]: string | React.ReactNode } = {
  company_token_holder_agreement: (
    <FormattedMessage id="eto.documents.company-token-holder-agreement" />
  ),
  investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
  pamphlet_template: <FormattedMessage id="eto.documents.pamphlet_template" />,
  prospectus_template: <FormattedMessage id="eto.documents.prospectus-Template" />,
  reservation_and_acquisition_agreement: (
    <FormattedMessage id="eto.documents.Reservation-and-Acquisition-Agreement" />
  ),
  termsheet_template: <FormattedMessage id="eto.documents.Termsheet-Template" />,
  bafin_approved_prospectus: <FormattedMessage id="eto.documents.Bafin-Approved-Prospectus" />,
  bafin_approved_pamphlet: <FormattedMessage id="eto.documents.Bafin-Approved-Pamphlet" />,
  signed_investment_and_shareholder_agreement: (
    <FormattedMessage id="eto.documents.investment-and-shareholder-agreement" />
  ),
};

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
        <DocumentTile
          title={immutableDocumentTitle[document.documentType]}
          extension={".doc"}
          blank={false}
          onlyDownload={true}
        />
      </div>
    </Col>
  );
};

class DocumentsComponent extends React.Component<IProps> {
  render(): React.ReactNode {
    const {
      loadingData,
      etoFilesData,
      generateTemplate,
      etoFileLoading,
      etoState,
      etoLinks,
      downloadDocumentByType,
    } = this.props;
    const { etoTemplates, uploadedDocuments, stateInfo } = etoFilesData;
    const generalUploadables = stateInfo ? stateInfo.uploadableDocuments : [];
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
                {Object.keys(etoTemplates).length === 0 && (
                  <Col className="mb-2">
                    <div>Please fill the ETO forms in order to generate templates</div>
                  </Col>
                )}
              </Row>

              <Row>
                <Col xs={12} className={styles.groupName}>
                  APPROVED PROSPECTUS AND AGREEMENTS TO UPLOAD
                </Col>
                {generalUploadables.map((key: etoDocumentType, index: number) => {
                  const typedFileName = immutableDocumentTitle[key];
                  const canUpload =
                    stateInfo &&
                    stateInfo.canUploadInStates[EtoStateEnum[etoState]].some(
                      fileName => fileName === key,
                    );
                  const isFileUploaded = Object.keys(uploadedDocuments).some(
                    uploadedKey => uploadedDocuments[uploadedKey].documentType === key,
                  );
                  return (
                    <Col xs={6} lg={3} key={index} className="mb-2">
                      <ETOAddDocuments documentType={key} disabled={!canUpload}>
                        <DocumentTile
                          title={typedFileName}
                          extension={".pdf"}
                          active={canUpload}
                          blank={!isFileUploaded}
                        />
                      </ETOAddDocuments>
                      {isFileUploaded && (
                        <div
                          onClick={() => downloadDocumentByType(key)}
                          className={cn(styles.subTitleDownload)}
                        >
                          Download
                        </div>
                      )}
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col xs={12} lg={4}>
              <SectionHeader className="my-4" layoutHasDecorator={false} />
              <Row>
                {etoLinks && (
                  <SingleColDocuments
                    documents={Object.keys(etoLinks).map(key => {
                      return etoLinks[key] as IEtoDocument;
                    })}
                    title="AGREEMENT AND PROSPECTUS TEMPLATES"
                    className={styles.documents}
                  />
                )}
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
  etoLinks?: DeepPartial<TEtoDocumentTemplates>;
}

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
  downloadDocumentByType: (documentType: etoDocumentType) => void;
}

export const Documents = compose<React.SFC>(
  onEnterAction({ actionCreator: d => d(actions.etoDocuments.loadFileDataStart()) }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      etoFilesData: selectEtoDocumentData(s.etoDocuments),
      loadingData: selectEtoLoading(s.etoFlow),
      etoFileLoading: selectEtoDocumentLoading(s.etoDocuments),
      etoState: selectCurrentEtoState(s.etoFlow),
      etoLinks: selectCurrentEtoTemplates(s.etoFlow),
    }),
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
      downloadDocumentByType: documentType =>
        dispatch(actions.etoDocuments.downloadDocumentByType(documentType)),
    }),
  }),
)(DocumentsComponent);
