import * as React from "react";
import Dropzone from "react-dropzone";
import { compose } from "redux";

import { TEtoUploadFile } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import * as styles from "./EtoAddDocument.module.scss";

interface IStateProps {
  fileUploading?: boolean;
}

interface IDispatchProps {
  onDropFile: (file: File, fileName: TEtoUploadFile) => void;
}

interface IOwnProps {
  children: React.ReactNode;
  fileName: TEtoUploadFile;
}
export const ETOAddDocumentsComponent: React.SFC<IStateProps & IDispatchProps & IOwnProps> = ({
  onDropFile,
  fileUploading,
  children,
  fileName,
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
    >
      {children}
    </Dropzone>
  );
};

export const ETOAddDocuments = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: () => ({}),
    dispatchToProps: dispatch => ({
      onDropFile: (file: File, fileName: TEtoUploadFile) =>
        dispatch(actions.etoFlow.etoUploadDocument(file, fileName)),
    }),
  }),
)(ETOAddDocumentsComponent);
