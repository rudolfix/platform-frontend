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

export interface IDocumentsGroup {
  name: TTranslatedString;
  documents: IDocument[];
}

interface IProps {
  groups: IDocumentsGroup[];
  className?: string;
}

export const SingleColDocumentsWidget: React.SFC<IProps> = ({ groups, className }) => {
  return (
    <Panel className={className}>
      {groups.map(({ name, documents }, i) => (
        <div key={i}>
          <Col className={styles.groupName}>{name}</Col>
          <div className={styles.group}>
            {documents.map(({ name, url }, i) => {
              return (
                <Col xs={12} className={styles.document} key={i}>
                  <InlineIcon svgIcon={attachmentIcon} className={styles.icon} width="30"/>
                  <a href={url} className={styles.documentLink}>
                    {name}
                  </a>
                </Col>
              );
            })}
          </div>
        </div>
      ))}
    </Panel>
  );
};
