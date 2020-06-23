import { Q18 } from "@neufund/shared-utils";

import icbmThumbnail from "../assets/img/eto_offers/investment_thumbnails_icbm_capital_raise.png";

export type TMockEto = {
  brandName: string;
  companyPreviewCardBanner: string;
  categories: string[];
  keyQuoteFounder: string;
  url: string;
  id: string;
  totalAmount?: string;
};

export const etoMockCompanies: TMockEto[] = [
  {
    brandName: "ICBM Capital Raise",
    url: "https://commit.neufund.org",
    totalAmount: Q18.mul("12582992.64").toString(),
    companyPreviewCardBanner: icbmThumbnail,
    id: "icbm",
    categories: ["Technology", "Blockchain"],
    keyQuoteFounder:
      "More than a thousand investors participated in Neufund’s first fundraise in 2017.",
  },
];
