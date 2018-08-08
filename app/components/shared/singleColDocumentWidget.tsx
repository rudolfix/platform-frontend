import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";

import { templates } from "../../lib/api/eto/EtoApi.interfaces";
import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

import * as styles from "./singleColDocumentWidget.module.scss";

const IPFS_LINK = "https://ipfs.io/ipfs/";
export interface IDocument {
  url: string;
  name: TTranslatedString;
}

interface IProps {
  documents: templates[];
  name: TTranslatedString;
  className?: string;
}

const documentName: { [key: string]: string } = {
  company_token_holder_agreement: "Company Token Holder Agreement",
  investment_and_shareholder_agreement: "Investment and Shareholder Agreement",
  pamphlet_template_en: "Pamphlet Template en",
  prospectus_template_en: "prospectus Template en",
  reservation_and_acquisition_agreement: "Reservation and Acquisition Agreement",
  termsheet_template: "Termsheet Template",
};

export const SingleColDocumentsWidget: React.SFC<IProps> = ({ documents, className, name }) => {
  return (
    <Panel className={className}>
      <Col className={styles.groupName}>{name}</Col>
      <div className={styles.group}>
        {documents.map(({ name, ipfsHash }, i) => {
          return (
            <Col xs={12} className={styles.document} key={i}>
              <i className={cn("fa fa-link", styles.documentIcon)} />
              <a href={IPFS_LINK + ipfsHash} className={styles.documentLink} target="_blank">
                {documentName[name]}
              </a>
            </Col>
          );
        })}
      </div>
    </Panel>
  );
};
