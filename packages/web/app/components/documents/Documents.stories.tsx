import {
  EEtoState,
  EETOStateOnChain,
  EOfferingDocumentType,
  ignoredTemplates,
  nomineeIgnoredTemplates,
} from "@neufund/shared-modules";
import { objectToFilteredArray } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { etoDocuments, etoFilesData, etoTemplates, testEto } from "../../../test/fixtures";
import { DocumentsLayout } from "./issuerDocuments/DocumentsLayout";
import { NomineeDocumentsLayout } from "./nomineeDocuments/NomineeDocumentsLayout";

const issuerProps: React.ComponentProps<typeof DocumentsLayout> = {
  etoFilesData: etoFilesData,
  etoState: EEtoState.ON_CHAIN,
  etoTemplates: objectToFilteredArray(
    (key: string) => !ignoredTemplates.some(templateKey => templateKey === key),
    etoTemplates,
  ),
  etoDocuments: etoDocuments,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
  generateTemplate: action("generateTemplate"),
  onChainState: EETOStateOnChain.Signing,
  documentsDownloading: {},
  documentsUploading: {},
  documentsGenerated: {},
  transactionPending: false,
  startDocumentDownload: action("startDocumentDownload"),
  startDocumentRemove: action("startDocumentRemove"),
  startDocumentUpload: action("startDocumentUpload"),
};

const nomineeProps: React.ComponentProps<typeof NomineeDocumentsLayout> = {
  nomineeEto: testEto,
  etoTemplates: objectToFilteredArray(
    (key: string) => !nomineeIgnoredTemplates.some(templateKey => templateKey === key),
    etoTemplates,
  ),
  documentsGenerated: {},
  generateTemplate: action("generateTemplate"),
};

storiesOf("ETO/Documents", module).add("default", () => <DocumentsLayout {...issuerProps} />);
storiesOf("Nominee/NomineeDocuments", module).add("default", () => (
  <NomineeDocumentsLayout {...nomineeProps} />
));
