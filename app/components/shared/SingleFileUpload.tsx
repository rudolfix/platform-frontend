import * as React from "react";
import * as styles from "./SingleFileUpload.module.scss";

import * as cn from "classnames";
import { IKycFileInfo } from "../../lib/api/KycApi.interfaces";

import Dropzone from "react-dropzone";

import * as uploadIcon from "../../assets/img/inline_icons/upload.svg";

import { Button } from "../shared/Buttons";
import { UploadedFiles } from "./UploadedFiles";

const ACCEPTED_FILES = "application/pdf, image/*";

interface IProps {
  className?: string;
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  fileFormatInformation: string;
  uploadCta: string;
  onDropFile: (file: File) => void;
}

export const SingleFileUpload: React.SFC<IProps> = ({ files, ...props }) => {
  const onDrop = (accepted: File[]) => accepted[0] && props.onDropFile(accepted[0]);

  const dropzoneInner = props.fileUploading ? <div>Uploading a File</div> : <div>Photo</div>;

  const dropzoneWithFilesInner = <span>Photo</span>;
  const dropzoneStyle = {
    width: "66px",
    height: "66px",
    display: "flex",
    cursor: "pointer",
  };
  const dropzoneWithFilesStyle = {
    color: "#000",
    display: "flex",
    cursor: "pointer",
  };

  return (
    <div className={cn(styles.upload, props.className)}>
      <div className={styles.uploadZone}>
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
        <div>
          {files.length ? (
            <UploadedFiles files={files} />
          ) : (
            <Button layout="secondary" iconPosition="icon-before" svgIcon={uploadIcon}>
              {props.uploadCta}
            </Button>
          )}
          <div className={styles.fileFormatInformation}>{props.fileFormatInformation}</div>
        </div>
      </div>
    </div>
  );
};
