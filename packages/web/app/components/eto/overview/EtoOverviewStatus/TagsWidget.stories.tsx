import { EOfferingDocumentType, IEtoDocument } from "@neufund/shared-modules";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import { TagsWidgetLayout } from "./TagsWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

const defaultProps = {
  downloadDocument: action("downloadDocument"),
  eto: testEto,
  termSheet: {} as IEtoDocument,
  smartContractOnChain: true,
  innerClass: styles.tagItem,
};

const prospectusEto = {
  ...testEto,
  product: {
    ...testEto.product,
    offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  },
};

const prospectusDocument = { name: "prospectusDocument.pdf" } as IEtoDocument;

storiesOf("ETO/TagsWidget", module)
  .add("not embedded", () => (
    <div style={{ width: "300px" }}>
      <h6>Offering Document Type Memorandum</h6>
      <TagsWidgetLayout {...defaultProps} isEmbedded={false} />
      <h6>Offering Document Type Memorandum (uploaded)</h6>
      <TagsWidgetLayout
        {...defaultProps}
        isEmbedded={false}
        investorOfferingDocumentApproved={prospectusDocument}
      />
      <h6>Offering Document Type Prospectus</h6>
      <TagsWidgetLayout {...defaultProps} isEmbedded={false} eto={prospectusEto} />
      <h6>Offering Document Type Prospectus Approved</h6>
      <TagsWidgetLayout
        {...defaultProps}
        isEmbedded={false}
        eto={prospectusEto}
        investorOfferingDocumentApproved={prospectusDocument}
      />
    </div>
  ))
  .add("embedded", () => (
    <div style={{ width: "300px" }}>
      <h6>Offering Document Type Memorandum</h6>
      <TagsWidgetLayout {...defaultProps} isEmbedded />
      <h6>Offering Document Type Memorandum (uploaded)</h6>
      <TagsWidgetLayout
        {...defaultProps}
        isEmbedded
        investorOfferingDocumentApproved={prospectusDocument}
      />
      <h6>Offering Document Type Prospectus</h6>
      <TagsWidgetLayout {...defaultProps} eto={prospectusEto} isEmbedded />
      <h6>Offering Document Type Prospectus Approved</h6>
      <TagsWidgetLayout
        {...defaultProps}
        eto={prospectusEto}
        isEmbedded
        investorOfferingDocumentApproved={prospectusDocument}
      />
    </div>
  ));
