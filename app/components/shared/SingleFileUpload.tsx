import * as cn from "classnames";
import * as React from "react";
import Dropzone from "react-dropzone";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../types";
import { dontPropagateEvent } from "../../utils/dontPropagate";
import { Button } from "../shared/Buttons";

import * as uploadIcon from "../../assets/img/inline_icons/upload.svg";
import * as styles from "./SingleFileUpload.module.scss";

export type TAcceptedFileType =
  | "application/pdf"
  | "image/png"
  | "image/jpg"
  | "image/jpeg"
  | "image/svg+xml"
  | "image/*";

interface IProps {
  acceptedFiles: TAcceptedFileType;
  fileUploading: boolean;
  file?: string;
  fileFormatInformation: string;
  label: string;
  onDropFile: (file: File) => void;
  onDeleteFile: () => void;
}

export class SingleFileUpload extends React.Component<IProps & CommonHtmlProps> {
  onDrop = (accepted: File[]) => accepted[0] && this.props.onDropFile(accepted[0]);

  render(): React.ReactNode {
    const {
      acceptedFiles,
      file,
      fileUploading,
      fileFormatInformation,
      label,
      className,
      style,
      onDeleteFile,
    } = this.props;
    const hasFile = !!file;

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
        acceptClassName="accept"
        rejectClassName="reject"
        disabledClassName="disabled"
        className={cn(styles.dropzone, className)}
        style={style}
      >
        <div className={styles.fakeDropzoneArea}>
          {hasFile ? <img src={file} alt={"File uploaded"} /> : dropzoneInner}
        </div>
        <div className={styles.sideBox}>
          {hasFile ? (
            <Button layout="secondary" onClick={dontPropagateEvent(onDeleteFile)}>
              Delete {label}
            </Button>
          ) : (
            <>
              <Button layout="secondary" iconPosition="icon-before" svgIcon={uploadIcon}>
                Upload {label}
              </Button>
              <div className={styles.acceptedFiles}>{fileFormatInformation}</div>
            </>
          )}
        </div>
      </Dropzone>
    );
  }
}
