import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import { IKycFileInfo } from "../../lib/api/KycApi.interfaces";
import { Button } from "../shared/Buttons";
import { UploadedFiles } from "./UploadedFiles";

import * as uploadIcon from "../../assets/img/inline_icons/upload.svg";
import * as styles from "./SingleFileUpload.module.scss";

type TAcceptedFileType =
  | "application/pdf"
  | "image/png"
  | "image/jpg"
  | "image/jpeg"
  | "image/svg+xml"
  | "image/*";

interface IProps {
  acceptedFiles: TAcceptedFileType;
  className?: string;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  fileFormatInformation: string;
  uploadCta: string;
  onDropFile: (file: File) => void;
}

export class SingleFileUpload extends React.Component<IProps> {
  onDrop = (accepted: File[]) => accepted[0] && this.props.onDropFile(accepted[0]);

  render(): React.ReactNode {
    const {
      acceptedFiles,
      className,
      files,
      fileUploading,
      fileFormatInformation,
      uploadCta,
    } = this.props;
    const hasFiles = !!files.length;

    const dropzoneInner = fileUploading ? (
      <div>
        <FormattedMessage id="shared-component.single-file-upload.uploading" />
      </div>
    ) : (
      <div>
        <FormattedMessage id="shared-component.single-file-upload.dropzone-cta" />
      </div>
    );

    return (
      <Dropzone
        accept={acceptedFiles}
        disabled={fileUploading}
        onDrop={this.onDrop}
        multiple={false}
        className={cn(styles.dropzone, className)}
        acceptClassName="accept"
        rejectClassName="reject"
        disabledClassName="disabled"
      >
        <div className={styles.fakeDropzoneArea}>
          {hasFiles ? (
            <img src={files[0] && files[0].preview} alt={files[0].fileName} />
          ) : (
            dropzoneInner
          )}
        </div>
        <div className={styles.sideBox}>
          {hasFiles ? (
            <UploadedFiles files={files} />
          ) : (
            <Button layout="secondary" iconPosition="icon-before" svgIcon={uploadIcon}>
              {uploadCta}
            </Button>
          )}
          <div className={styles.acceptedFiles}>{fileFormatInformation}</div>
        </div>
      </Dropzone>
    );
  }
}
