import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";
import * as styles from "./singleColDocumentWidget.module.scss";

import { compose } from "redux";
import { templates } from "../../lib/api/eto/EtoApi.interfaces";
import { ImmutableFileId } from "../../lib/api/ImmutableStorage.interfaces";
import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";


const IPFS_LINK = "https://ipfs.io/ipfs/";
export interface IDocument {
  url: string;
  name: TTranslatedString;
}

interface IOwnProps {
  documents: templates[];
  name: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: ImmutableFileId) => void;
}

type IProps = IOwnProps & IDispatchProps;

const documentName: { [key: string]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  pamphlet_template_en: "Pamphlet Template en",
  prospectus_template_en: "prospectus Template en",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  termsheet_template: "Termsheet Template",
};

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
                /* href={IPFS_LINK + ipfsHash} */ className={styles.documentLink}
                onClick={() =>
                  downloadImmutableFile({
                    ...{ ipfsHash, mimeType, name },
                    // Links should never be downloaded pdf
                    asPdf: false,
                  })
                }
              >
                {documentName[name]}
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
