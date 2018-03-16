import * as React from "react";
import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";
import * as styles from "./UploadedFiles.module.scss";

import * as confirmIcon from "../../../assets/img/notfications/Success_small.svg";

import * as removeIcon from "../../../assets/img/inline_icons/trash.svg";
import { InlineIcon } from "../../shared/InlineIcon";

interface IProps {
  files: IKycFileInfo[];
  onRemove: () => void;
}

export const UploadedFiles: React.SFC<IProps> = ({ files, onRemove }) => (
  <div className={styles.uploadedFiles}>
    {files.map(({ fileName }) => (
      <div key={fileName} className={styles.file}>
        <span className={styles.remove} onClick={() => onRemove()}>
          <InlineIcon svgIcon={removeIcon} />
        </span>
        <span className={styles.text} title={fileName}>
          {fileName}
        </span>
        <img src={confirmIcon} className={styles.icon} />
      </div>
    ))}
  </div>
);
