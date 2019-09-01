import * as React from "react";

import { IEtoDocument } from "../../lib/api/eto/EtoFileApi.interfaces";
import { TTranslatedString } from "../../types";
import { ClickableDocumentTile } from "../shared/Document";

import * as styles from "./Documents.module.scss";

type TDocumentListProps = {
  etoTemplates: IEtoDocument[];
  generateTemplate: (document: IEtoDocument) => void;
  documentsGenerated: { [ipfsHash: string]: boolean };
  documentTitles: { [title: string]: TTranslatedString };
  fallbackText: TTranslatedString;
};

export const DocumentList: React.FunctionComponent<TDocumentListProps> = ({
  etoTemplates,
  generateTemplate,
  documentsGenerated,
  documentTitles,
  fallbackText,
}) => (
  <>
    {etoTemplates.length !== 0 ? (
      etoTemplates.map(template => (
        <ClickableDocumentTile
          key={template.ipfsHash}
          document={template}
          generateTemplate={generateTemplate}
          title={documentTitles[template.documentType]}
          extension={".doc"}
          busy={documentsGenerated[template.ipfsHash]}
        />
      ))
    ) : (
      <div className={styles.note}>{fallbackText}</div>
    )}
  </>
);
