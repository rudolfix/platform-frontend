import * as cn from "classnames";
import * as React from "react";
import { Col } from "reactstrap";

import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

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
              <i className={cn("fa fa-link", styles.documentIcon)} />
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
