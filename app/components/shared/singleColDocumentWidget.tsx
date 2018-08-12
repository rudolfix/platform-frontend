import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";
import * as styles from "./singleColDocumentWidget.module.scss";

import { compose } from "redux";
import { IEtoDocument, immutableDocumentName } from "../../lib/api/eto/EtoFileApi.interfaces";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

interface IOwnProps {
  documents: IEtoDocument[];
  title: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId, fileName: string) => void;
}

type IProps = IOwnProps & IDispatchProps;

export const SingleColDocumentsWidget: React.SFC<IProps> = ({
  documents,
  className,
  title,
  downloadImmutableFile,
}) => {
  return (
    <Panel className={className}>
      <Col className={styles.groupName}>{title}</Col>
      <div className={styles.group}>
        {documents.map(({ ipfsHash, mimeType, documentType }, i) => {
          return (
            <Col xs={12} className={styles.document} key={i}>
              <i className={cn("fa fa-link", styles.documentIcon)} />
              <div
                className={styles.documentLink}
                onClick={() =>
                  downloadImmutableFile(
                    {
                      ...{ ipfsHash, mimeType },
                      asPdf: false,
                    },
                    immutableDocumentName[documentType],
                  )
                }
              >
                {immutableDocumentName[documentType]}
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
      downloadImmutableFile: (fileId, name) =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId, name)),
    }),
  }),
)(SingleColDocumentsWidget);
