import * as React from "react";
import * as styles from "./MultiFileUpload.module.scss";

import * as cn from "classnames";
import { IKycFileInfo, TKycRequestType } from "../../lib/api/KycApi.interfaces";

import Dropzone from "react-dropzone";

import * as addFileIcon from "../../assets/img/add_file.svg";
import * as idImage from "../../assets/img/id_img.svg";

import { InlineIcon } from "../shared/InlineIcon";
import { UploadedFiles } from "./UploadedFiles";

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
      <div>Uploading a File</div>
    </>
  ) : (
    <>
      <img src={addFileIcon} />
      <span>
        Drag and drop your files here or <strong>upload</strong>
      </span>
    </>
  );

  const dropzoneWithFilesInner = (
    <>
      <InlineIcon svgIcon={plusIcon} />
      {layout === "individual" && <span>Add more</span>}
      {layout === "business" && <span>Upload more documents</span>}
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
        {layout === "individual" && <h3 className={styles.title}>Images must include</h3>}
        {layout === "business" && <h3 className={styles.title}>Required documents</h3>}
        {layout === "individual" && <img src={idImage} />}
        <div>
          {layout === "individual" && (
            <ul className={styles.documentRequirements}>
              <li>Colored photo</li>
              <li>Full name</li>
              <li>Date of birth</li>
              <li>Valid expiration date</li>
              <li>Official document number</li>
            </ul>
          )}

          {layout === "business" && (
            <ul className={styles.documentRequirements}>
              <li>Commercial register entry</li>
              <li>Article of ssociation</li>
              <li>Partnership agreement</li>
              <li>Proof of address (non-german entities only)</li>
            </ul>
          )}
        </div>
      </div>
      <div className={styles.uploadZone}>
        <h3 className={styles.title}>Upload documents</h3>
        {!!files.length && <UploadedFiles onRemove={() => {}} files={files} />}
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
          Please upload .pdf or .jpg files containing colored scans in good quality.
        </div>
      </div>
    </div>
  );
};
