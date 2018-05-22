import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { IKycFileInfo, TKycRequestType } from "../../lib/api/KycApi.interfaces";

import { InlineIcon } from "../shared/InlineIcon";
import { UploadedFiles } from "./UploadedFiles";

import * as addFileIcon from "../../assets/img/add_file.svg";
import * as idImage from "../../assets/img/id_img.svg";
import * as styles from "./MultiFileUpload.module.scss";

const ACCEPTED_FILES = "application/pdf, image/*";

import * as plusIcon from "../../assets/img/inline_icons/plus.svg";

interface IProps {
  className?: string;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  layout: TKycRequestType;
  onDropFile: (file: File) => void;
}

export const MultiFileUpload: React.SFC<IProps> = ({ files, layout, ...props }) => {
  const onDrop = (accepted: File[]) => accepted[0] && props.onDropFile(accepted[0]);

  const dropzoneInner = props.fileUploading ? (
    <>
      <img src={addFileIcon} />
      <div>
        <FormattedMessage id="shared-component.multi-file-upload.uploading" />
      </div>
    </>
  ) : (
    <>
      <img src={addFileIcon} />
      <FormattedHTMLMessage tagName="span" id="shared-component.multi-file-upload.upload-cta" />
    </>
  );

  const dropzoneWithFilesInner = (
    <>
      <InlineIcon svgIcon={plusIcon} />
      {layout === "individual" && (
        <span>
          <FormattedMessage id="shared-component.multi-file-upload.individual.add-more" />
        </span>
      )}
      {layout === "business" && (
        <span>
          <FormattedMessage id="shared-component.multi-file-upload.business.add-more" />
        </span>
      )}
    </>
  );
  const dropzoneStyle = {
    width: "210px",
    height: "210px",
    display: "flex",
    cursor: "pointer",
  };
  const dropzoneWithFilesStyle = {
    color: "#000",
    display: "flex",
    cursor: "pointer",
  };

  return (
    <div className={cn(styles.upload, layout, props.className)}>
      <div className={styles.uploadDescription}>
        {layout === "individual" && (
          <h3 className={styles.title}>
            <FormattedMessage id="shared-component.multi-file-upload.individual.images-must-be-included" />
          </h3>
        )}
        {layout === "business" && (
          <h3 className={styles.title}>
            <FormattedMessage id="shared-component.multi-file-upload.business.required-documents" />
          </h3>
        )}
        {layout === "individual" && <img className={styles.sampleDocumentId} src={idImage} />}
        <div>
          {layout === "individual" && (
            <ul className={styles.documentRequirements}>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.individual.id.colored-photo" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.individual.id.full-name" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.individual.id.date-of-birth" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.individual.id.expiration-date" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.individual.id.number" />
              </li>
            </ul>
          )}

          {layout === "business" && (
            <ul className={styles.documentRequirements}>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.business.id.commercial-register" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.business.id.association" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.business.id.partnership" />
              </li>
              <li>
                <FormattedMessage id="shared-component.multi-file-upload.business.id.address" />
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className={styles.uploadZone}>
        <h3 className={styles.title}>
          <FormattedMessage id="shared-component.multi-file-upload.upload-documents" />
        </h3>
        {files.length > 0 && <UploadedFiles files={files} />}
        <div className={files.length ? styles.dropzoneWithFilesWrapper : styles.dropzoneWrapper}>
          <Dropzone
            accept={ACCEPTED_FILES}
            onDrop={onDrop}
            disabled={props.fileUploading}
            style={files.length ? dropzoneWithFilesStyle : dropzoneStyle}
          >
            {files.length ? dropzoneWithFilesInner : dropzoneInner}
          </Dropzone>
        </div>
        <div className={styles.documentRequirements}>
          <FormattedMessage id="shared-component.multi-file-upload.allowed-documents" />
        </div>
      </div>
    </div>
  );
};
