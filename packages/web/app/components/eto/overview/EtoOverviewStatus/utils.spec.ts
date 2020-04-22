import { expect } from "chai";

import { EOfferingDocumentType } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { EDocumentType, getApprovedDocumentButtonType } from "./utils";

describe("getApprovedDocumentTitle", () => {
  it("returns correct document type", () => {
    expect(getApprovedDocumentButtonType(EOfferingDocumentType.PROSPECTUS, true)).to.be.equal(
      EDocumentType.PROSPECTUS_APPROVED,
    );
    expect(getApprovedDocumentButtonType(EOfferingDocumentType.MEMORANDUM, true)).to.be.equal(
      EDocumentType.INVESTMENT_MEMORANDUM,
    );
    expect(getApprovedDocumentButtonType(EOfferingDocumentType.MEMORANDUM, false)).to.be.equal(
      EDocumentType.INVESTMENT_MEMORANDUM,
    );
    expect(getApprovedDocumentButtonType(EOfferingDocumentType.PROSPECTUS, false)).to.be.equal(
      EDocumentType.PROSPECTUS,
    );
  });
});
