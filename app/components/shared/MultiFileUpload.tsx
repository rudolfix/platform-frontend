import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import { IKycFileInfo, TKycRequestType } from "../../lib/api/KycApi.interfaces";

import { InlineIcon } from "../shared/InlineIcon";
import { UploadedFiles } from "./UploadedFiles";

import { TAcceptedFileType, TTranslatedString } from "../../types";

import * as addFileIcon from "../../assets/img/inline_icons/add_file.svg";
import * as styles from "./MultiFileUpload.module.scss";

interface IProps {
  title: TTranslatedString;
  uploadType: TKycRequestType;
  acceptedFiles: TAcceptedFileType;
  documentTemplateImage?: string;
  fileUploading: boolean;
  files?: IKycFileInfo[];
  fileInfo: TTranslatedString;
  requirements?: TTranslatedString[];
  onDropFile: (file: File) => void;
  "data-test-id"?: string;
}

export const individualRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.colored-photo" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.full-name" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.date-of-birth" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.valid-expiration-date" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.official-document-number" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.individual.high-quality" />,
];

export const businessRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.proof-of-address" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.article-of-association" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.commercial-register-entry" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.business.partnership-agreement" />,
];

export const addressRequirements = [
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.full-name" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.current-address" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.date" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.issuing-company" />,
  <FormattedMessage id="shared-component.multi-file-upload.requirements.address.high-quality" />,
];

export const MultiFileUpload: React.SFC<IProps> = ({
  acceptedFiles,
  fileUploading,
  requirements,
  files,
  title,
  fileInfo,
  "data-test-id": dataTestId,
  ...props
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && props.onDropFile(accepted[0]);

  const dropzoneInner = fileUploading ? (
    <FormattedMessage id="shared-component.multi-file-upload.uploading" />
  ) : (
    <FormattedMessage id="shared-component.multi-file-upload.upload-cta" />
  );

  const dropzoneWithFilesInner = (
    <FormattedMessage id="shared-component.multi-file-upload.add-more" />
  );

  return (
    <>
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.fileInfo}>{fileInfo}</h4>
      <div data-test-id={dataTestId} className={styles.multiFileUpload}>
        {props.documentTemplateImage && (
          <div className={styles.documentWrapper}>
            <img src={props.documentTemplateImage} />
          </div>
        )}

        <div className={styles.dropzoneWrapper}>
          <Dropzone
            accept={acceptedFiles}
            onDrop={onDrop}
            disabled={fileUploading}
            className={styles.dropzone}
            {...props}
          >
            <InlineIcon svgIcon={addFileIcon} width="48px" height="50px" />
            {files && files.length ? dropzoneWithFilesInner : dropzoneInner}
          </Dropzone>

          {files && files.length > 0 ? (
            <UploadedFiles files={files} />
          ) : (
            requirements && (
              <div className={styles.requirements}>
                <p className={styles.requirementsTitle}>
                  <FormattedMessage id="shared-component.multi-file-upload.requirements.title" />
                </p>
                <ul>{requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
