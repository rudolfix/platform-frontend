import * as React from "react";

import { TTranslatedString } from "../../types";
import { Document } from "./Document";

import * as styles from "./DocumentLink.module.scss";

export interface IDocumentLinkProps {
  url: string;
  name: TTranslatedString;
  altIcon?: React.ReactNode;
}

export const DocumentLink: React.SFC<IDocumentLinkProps> = ({ url, name, altIcon }) => {
  return (
    <a href={url} className={styles.documentLink} target="_blank">
      {altIcon || <Document extension={url} />}
      {name}
    </a>
  );
};
