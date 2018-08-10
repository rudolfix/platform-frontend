import * as React from "react";
import Dropzone from "react-dropzone";
import { compose } from "redux";

import { IKycFileInfo, TKycRequestType } from "../../../lib/api/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import * as styles from "./EtoAddDocument.module.scss";

interface IDispatchProps {
  onDropFile: (file: File, document: IEtoDocument) => void;
}

interface IOwnProps {
  children: React.ReactNode;
  document: IEtoDocument;
  disabled?: boolean;
}
export const ETOAddDocumentsComponent: React.SFC<IDispatchProps & IOwnProps> = ({
  onDropFile,
  children,
  document,
  disabled,
}) => {
  const onDrop = (accepted: File[]) => accepted[0] && onDropFile(accepted[0], document);
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
      onDropFile: (file: File, document: IEtoDocument) =>
        dispatch(
          actions.etoDocuments.showIpfsModal(() =>
            dispatch(actions.etoDocuments.etoUploadDocument(file, document)),
          ),
        ),
    }),
  }),
)(ETOAddDocumentsComponent);
