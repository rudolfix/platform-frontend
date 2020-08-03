import { ButtonInline } from "@neufund/design-system";
import { EEtoDocumentType } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";
import { ETOAddDocuments } from "../documents/issuerDocuments/EtoAddDocument";
import { DocumentTile } from "./Document";
import { InlineIcon } from "./icons/InlineIcon";

import error from "../../assets/img/inline_icons/error.svg";
import warning from "../../assets/img/inline_icons/warning.svg";
import * as styles from "./Document.module.scss";

const MAX_UPLOADABLE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_UPLOADABLE_SIZE_LABEL = "20MB";

interface IUploadableDocumentTileProps {
  documentKey: EEtoDocumentType;
  active: boolean;
  typedFileName: TTranslatedString;
  isFileUploaded: boolean;
  downloadDocumentStart?: (documentType: EEtoDocumentType) => void;
  startDocumentRemove: (documentType: EEtoDocumentType) => void;
  documentDownloadLinkInactive: boolean;
  busy?: boolean;
  disabled?: boolean;
  uploadedFileName?: string;
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

interface IUploadableDocumentDropzone {
  isDisabled?: boolean;
  documentKey: EEtoDocumentType;
  active: boolean;
  typedFileName: TTranslatedString;
  busy?: boolean;
  isFileUploaded: boolean;
  downloadDocumentStart?: (documentType: EEtoDocumentType) => void;
  uploadedFileName?: string;
  onDropFile: (file: File, documentType: EEtoDocumentType) => void;
}

type TDocumentUploadTermsChangedProps = {
  documentKey: EEtoDocumentType;
  downloadDocumentStart?: (documentType: EEtoDocumentType) => void;
  uploadedFileName?: string;
};

const DocumentUploadDropzoneError: React.FunctionComponent = () => (
  <div className={styles.error}>
    <InlineIcon svgIcon={error} className={styles.errorIcon} />
    <p>
      <FormattedMessage id="documents.upload.file-rejected" />
    </p>
  </div>
);

const DocumentUploadTypeDescription: React.FunctionComponent<{
  typedFileName: TTranslatedString;
}> = ({ typedFileName }) => (
  <>
    <p className={styles.uploadTitle}>{typedFileName}</p>
    <p className={styles.fileSize}>
      <FormattedMessage
        id="documents.upload.file-size"
        values={{ size: MAX_UPLOADABLE_SIZE_LABEL }}
      />
    </p>
  </>
);

const DocumentUploadTermsChanged: React.FunctionComponent<TDocumentUploadTermsChangedProps> = ({
  downloadDocumentStart,
  documentKey,
  uploadedFileName,
}) => (
  <>
    <small>
      <ButtonInline
        data-test-id="documents-download-document"
        onClick={downloadDocumentStart && (() => downloadDocumentStart(documentKey))}
      >
        {uploadedFileName}
      </ButtonInline>
    </small>
    <div className={styles.warning}>
      <InlineIcon svgIcon={warning} className={styles.warningIcon} />
      <p>
        <FormattedMessage id="documents.upload.terms-changed" />
      </p>
    </div>
  </>
);

export const DocumentUploadableDropzone: React.FunctionComponent<IUploadableDocumentDropzone> = ({
  isDisabled,
  documentKey,
  active,
  typedFileName,
  busy,
  isFileUploaded,
  downloadDocumentStart,
  uploadedFileName,
  onDropFile,
}) => {
  const [rejected, setRejected] = React.useState(false);

  return (
    <>
      <ETOAddDocuments
        documentType={documentKey}
        disabled={isDisabled}
        maxSize={MAX_UPLOADABLE_SIZE}
        onDropRejected={() => setRejected(true)}
        onDropAccepted={() => setRejected(false)}
        isUploading={!!busy}
        onDropFile={onDropFile}
      />
      <DocumentUploadTypeDescription typedFileName={typedFileName} />
      {rejected && <DocumentUploadDropzoneError />}
      {/* TODO: Show when ETO terms changed*/}
      {active && isFileUploaded && (
        <DocumentUploadTermsChanged
          documentKey={documentKey}
          downloadDocumentStart={downloadDocumentStart}
          uploadedFileName={uploadedFileName}
        />
      )}
    </>
  );
};

export const DocumentUploadableTile: React.FunctionComponent<IUploadableDocumentTileProps> = ({
  documentKey,
  active,
  typedFileName,
  isFileUploaded,
  downloadDocumentStart,
  documentDownloadLinkInactive,
  busy,
  disabled,
  startDocumentRemove,
  uploadedFileName,
  onDropFile,
}) => {
  const linkDisabled = documentDownloadLinkInactive || busy;
  const isDisabled = !active || busy || disabled;

  return (
    <div data-test-id={`form.name.${documentKey}`}>
      {isFileUploaded ? (
        <>
          <DocumentTile
            title={typedFileName}
            extension={".pdf"}
            activeUpload={active}
            blank={!isFileUploaded}
            busy={busy}
            downloadAction={downloadDocumentStart && (() => downloadDocumentStart(documentKey))}
            fileName={uploadedFileName}
            removeAction={() => startDocumentRemove(documentKey)}
            linkDisabled={linkDisabled}
          />
        </>
      ) : (
        <DocumentUploadableDropzone
          isDisabled={isDisabled}
          documentKey={documentKey}
          active={active}
          typedFileName={typedFileName}
          busy={busy}
          isFileUploaded={isFileUploaded}
          downloadDocumentStart={downloadDocumentStart}
          uploadedFileName={uploadedFileName}
          onDropFile={onDropFile}
        />
      )}
    </div>
  );
};
