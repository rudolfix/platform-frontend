import { Button, EButtonLayout, EButtonSize, EButtonWidth } from "@neufund/design-system";
import { IKycFileInfo } from "@neufund/shared-modules";
import cn from "classnames";
import * as React from "react";
import trashIcon from "../../assets/img/inline_icons/delete.svg";

import * as styles from "./UploadedFiles.module.scss";

interface IProps {
  files: ReadonlyArray<IKycFileInfo>;
  onDelete?: (index: number) => void;
}

export const UploadedFiles: React.FunctionComponent<IProps> = ({ files, onDelete }) => (
  <div className={cn("c-uploaded-files", styles.uploadedFiles)}>
    {files.map(({ fileName, id, preview }, index) => (
      <div data-test-id={`multi-file-upload-file-${fileName}`} key={index} className={styles.file}>
        <span className={styles.text} title={fileName}>
          {fileName} {preview}
        </span>
        {onDelete && (
          <Button
            svgIcon={trashIcon}
            iconProps={{ className: styles.deleteButton }}
            layout={EButtonLayout.LINK}
            size={EButtonSize.NORMAL}
            width={EButtonWidth.NO_PADDING}
            onClick={() => onDelete(index)}
          />
        )}
        {/* TODO Add ability to download file */}
      </div>
    ))}
  </div>
);
