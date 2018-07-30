import * as React from "react";
import Dropzone from "react-dropzone";
import { compose } from "redux";

import { TEtoUploadFile } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, fileName: TEtoUploadFile) => void;
}

interface IOwnProps {
  children: React.ReactNode;
  fileName: TEtoUploadFile;
  disabled?: boolean;
}
export const ETOAddDocumentsComponent: React.SFC<IDispatchProps & IOwnProps> = ({
  onDropFile,
  children,
  fileName,
  disabled,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0], fileName);
  return (
    <Dropzone
      accept="application/pdf,application/msword"
      onDrop={onDrop}
      activeClassName={styles.invisible}
      acceptClassName={styles.invisible}
      rejectClassName={styles.invisible}
      disabledClassName={styles.invisible}
      className={styles.invisible}
      disabled={disabled}
    >
      {children}
    </Dropzone>
  );
};

export const ETOAddDocuments = compose<React.SFC<IOwnProps>>(
  appConnect<{}, IDispatchProps, IOwnProps>({
    dispatchToProps: dispatch => ({
      onDropFile: (file: File, fileName: TEtoUploadFile) =>
        dispatch(
          actions.etoFlow.showIpfsModal(() =>
            dispatch(actions.etoFlow.etoUploadDocument(file, fileName)),
          ),
        ),
    }),
  }),
)(ETOAddDocumentsComponent);
