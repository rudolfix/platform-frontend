import * as React from "react";
import { Link } from "react-router-dom";
import { Col } from "reactstrap";

import { TTranslatedString } from "../../types";
import { DocumentLink } from "./DocumentLink";
import { InlineIcon } from "./InlineIcon";
import { Panel } from "./Panel";

import * as attachmentIcon from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./singleColDocumentWidget.module.scss";

export interface IDocument {
  url: string;
  name: TTranslatedString;
}

interface IProps {
  documents: IDocument[];
  name: TTranslatedString;
  className?: string;
}

export const SingleColDocumentsWidget: React.SFC<IProps> = ({ documents, className, name }) => {
  return (
    <Panel className={className}>
      <Col className={styles.groupName}>{name}</Col>
      <div className={styles.group}>
        {documents.map(({ name, url }, i) => {
          return (
            <Col xs={12} className={styles.document} key={i}>
              <InlineIcon svgIcon={attachmentIcon} className={styles.icon} width="30" />
              <a href={url} className={styles.documentLink}>
                {name}
              </a>
            </Col>
          );
        })}
      </div>
    </Panel>
  );
};
