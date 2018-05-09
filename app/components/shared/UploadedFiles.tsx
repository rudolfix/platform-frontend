import * as React from "react";
import { IKycFileInfo } from "../../lib/api/KycApi.interfaces";
import * as styles from "./UploadedFiles.module.scss";

import * as confirmIcon from "../../assets/img/notifications/Success_small.svg";
import { IEtoFileInfo } from "../../lib/api/EtoApi.interfaces";

interface IProps {
  files: IKycFileInfo[] | IEtoFileInfo[];
}

export const UploadedFiles: React.SFC<IProps> = ({ files }) => (
  <div className={styles.uploadedFiles}>
    {files.map(({ fileName }, index) => (
      <div key={index} className={styles.file}>
        <span className={styles.text} title={fileName}>
          {fileName}
        </span>
        <img src={confirmIcon} className={styles.icon} />
      </div>
    ))}
  </div>
);
