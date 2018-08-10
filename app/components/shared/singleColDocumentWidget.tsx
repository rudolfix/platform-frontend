import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";
import * as styles from "./singleColDocumentWidget.module.scss";

import { compose } from "redux";
import { etoDocumentType, IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { immutableDocumentName, ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

interface IOwnProps {
  documents: IEtoDocument[];
  name: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId) => void;
}

type IProps = IOwnProps & IDispatchProps;

export const SingleColDocumentsWidget: React.SFC<IProps> = ({
  documents,
  className,
  name,
  downloadImmutableFile,
}) => {
  return (
    <Panel className={className}>
      <Col className={styles.groupName}>{name}</Col>
      <div className={styles.group}>
        {documents.map(({ ipfsHash, mimeType, name }, i) => {
          return (
            <Col xs={12} className={styles.document} key={i}>
              <i className={cn("fa fa-link", styles.documentIcon)} />
              <div
                className={styles.documentLink}
                onClick={() =>
                  downloadImmutableFile({
                    ...{ ipfsHash, mimeType, name: name as etoDocumentType },
                    // Links should never be downloaded pdf
                    asPdf: false,
                  })
                }
              >
                {immutableDocumentName[name]}
              </div>
            </Col>
          );
        })}
      </div>
    </Panel>
  );
};

export const SingleColDocuments = compose<React.SFC<IOwnProps>>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadImmutableFile: fileId =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId)),
    }),
  }),
)(SingleColDocumentsWidget);
