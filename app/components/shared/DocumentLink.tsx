import * as React from "react";
import { TTranslatedString } from "../../types";
import { Document } from "./Document";
import * as styles from "./DocumentLink.module.scss";

export interface IDocumentLinkProps {
  url: string;
  name: TTranslatedString;
}

export const DocumentLink: React.SFC<IDocumentLinkProps> = ({ url, name }) => {
  return (
    <a href={url} className={styles.documentLink}>
      <Document extension={url} />
      {name}
    </a>
  );
};
