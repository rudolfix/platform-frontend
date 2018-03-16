import * as React from "react";
import * as styles from "./KycFileUploadList.module.scss";

import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";

import Dropzone from "react-dropzone";

import * as addFileIcon from "../../../assets/img/add_file.svg";
import * as idImage from "../../../assets/img/id_img.svg";
import { InlineIcon } from "../../shared/InlineIcon";
import { UploadedFiles } from "./UploadedFiles";

const ACCEPTED_FILES = "application/pdf, image/*";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";

interface IProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  onDropFile: (file: File) => void;
}

export const KycFileUploadList: React.SFC<IProps> = ({ files, ...props }) => {
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
      <span>Add more</span>
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
    <div className={styles.upload}>
      <div className={styles.uploadDescription}>
        <h3 className={styles.title}>Images must include</h3>
        <img src={idImage} />
        <ul className={styles.documentRequirements}>
          <li>colored photo</li>
          <li>Full name</li>
          <li>Date of birth</li>
          <li>Valid expiration date</li>
          <li>Official document number</li>
        </ul>
      </div>
      <div className={styles.uploadZone}>
        <h3 className={styles.title}>Upload documents</h3>
        {files && <UploadedFiles onRemove={() => {}} files={files} />}
        <div className={files ? styles.dropzoneWithFilesWrapper : styles.dropzoneWrapper}>
          <Dropzone
            accept={ACCEPTED_FILES}
            onDrop={onDrop}
            disabled={props.fileUploading}
            style={files ? dropzoneWithFilesStyle : dropzoneStyle}
          >
            {files ? dropzoneWithFilesInner : dropzoneInner}
          </Dropzone>
        </div>
      </div>
    </div>
  );
};
