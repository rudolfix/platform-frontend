import * as React from "react";
import * as styles from "./KycFileUploadList.module.scss";

import * as cn from "classnames";
import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";

import Dropzone from "react-dropzone";

import * as addFileIcon from "../../../assets/img/add_file.svg";
import * as idImage from "../../../assets/img/id_img.svg";
import { InlineIcon } from "../../shared/InlineIcon";
import { UploadedFiles } from "./UploadedFiles";

const ACCEPTED_FILES = "application/pdf, image/*";

import * as plusIcon from "../../../assets/img/inline_icons/plus.svg";

export type TUploadListLayout = "business" | "personal";

interface IProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  layout: TUploadListLayout;
  onDropFile: (file: File) => void;
}

export const KycFileUploadList: React.SFC<IProps> = ({ files, layout, ...props }) => {
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
      {layout === "personal" && <span>Add more</span>}
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
    <div className={cn(styles.upload, layout)}>
      <div className={styles.uploadDescription}>
        <h3 className={styles.title}>Images must include</h3>
        <img src={idImage} />
        <div>
          {layout === "business" && <strong>Images must include</strong>}
          <ul className={styles.documentRequirements}>
            <li>colored photo</li>
            <li>Full name</li>
            <li>Date of birth</li>
            <li>Valid expiration date</li>
            <li>Official document number</li>
          </ul>
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
      </div>
    </div>
  );
};
