import { assertNever } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EOfferingDocumentType } from "./../../../../lib/api/eto/EtoProductsApi.interfaces";

export enum EDocumentType {
  PROSPECTUS_APPROVED,
  PROSPECTUS,
  INVESTMENT_MEMORANDUM,
}

export const getApprovedDocumentButtonType = (
  offeringDocumentType: EOfferingDocumentType,
  hasProspectusDocument: boolean,
) => {
  switch (offeringDocumentType) {
    case EOfferingDocumentType.PROSPECTUS:
      if (hasProspectusDocument) {
        return EDocumentType.PROSPECTUS_APPROVED;
      }
      return EDocumentType.PROSPECTUS;

    case EOfferingDocumentType.MEMORANDUM:
      return EDocumentType.INVESTMENT_MEMORANDUM;

    default:
      return assertNever(offeringDocumentType);
  }
};

export const getDocumentTagProps = (
  offeringDocumentType: EOfferingDocumentType,
  hasProspectusDocument: boolean,
) => {
  const documentType = getApprovedDocumentButtonType(offeringDocumentType, hasProspectusDocument);
  switch (documentType) {
    case EDocumentType.INVESTMENT_MEMORANDUM:
      return {
        textElement: <FormattedMessage id="shared-component.eto-overview.investment-memorandum" />,
        "data-test-id": "eto-overview-investment-memorandum-button",
      };
    case EDocumentType.PROSPECTUS:
      return {
        textElement: <FormattedMessage id="shared-component.eto-overview.prospectus" />,
        "data-test-id": "eto-overview-prospectus-button",
      };
    case EDocumentType.PROSPECTUS_APPROVED:
      return {
        textElement: <FormattedMessage id="shared-component.eto-overview.prospectus-approved" />,
        "data-test-id": "eto-overview-prospectus-approved-button",
      };
    default:
      return assertNever(documentType);
  }
};
