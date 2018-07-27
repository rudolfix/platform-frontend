import * as React from "react";

import { TTranslatedString } from "../../types";
import { Panel } from "./Panel";

import { DocumentLink } from "./DocumentLink";
import * as styles from "./DocumentsWidget.module.scss";

export interface IDocument {
  url: string;
  name: TTranslatedString;
  icon?: React.ReactNode;
}

export interface IDocumentsGroup {
  name: TTranslatedString;
  documents: IDocument[];
}

interface IProps {
  groups: IDocumentsGroup[];
  className?: string;
}

export const DocumentsWidget: React.SFC<IProps> = ({ groups, className }) => {
  return (
    <Panel className={className}>
      {groups.map(({ name, documents }, i) => (
        <div key={i}>
          <div className={styles.groupName}>{name}</div>
          <div className={styles.group}>
            {documents.map(({ name, url, icon }, i) => {
              return (
                <div className={styles.document} key={i}>
                  <DocumentLink url={url} name={name} altIcon={icon} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Panel>
  );
};
