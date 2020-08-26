import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes, TAppRoute } from "../../appRoutes";

export enum EGovernancePage {
  OVERVIEW = "overview",
  GENERAL_INFORMATION = "general-information",
  CAP_TABLE = "cap-table",
  DIVIDENDS = "dividends",
  TOKEN_MANAGEMENT = "token-management",
  ESOP = "esop",
  EXIT = "exit",
}

export type TGovernancePage = {
  key: EGovernancePage;
  to: TAppRoute;
  comingSoon?: boolean;
  label: React.ReactNode;
};

export const GovernancePages: Array<TGovernancePage> = [
  {
    key: EGovernancePage.OVERVIEW,
    to: appRoutes.governanceOverview,
    label: <FormattedMessage id="governance.title.overview" />,
  },
  {
    key: EGovernancePage.GENERAL_INFORMATION,
    to: appRoutes.governanceGeneralInformation,
    label: <FormattedMessage id="governance.title.general-information" />,
  },
  {
    key: EGovernancePage.CAP_TABLE,
    to: appRoutes.governanceCapTable,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.cap-table" />,
  },
  {
    key: EGovernancePage.DIVIDENDS,
    to: appRoutes.governanceDividends,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.dividends" />,
  },
  {
    key: EGovernancePage.TOKEN_MANAGEMENT,
    to: appRoutes.governanceTokenManagement,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.token-management" />,
  },
  {
    key: EGovernancePage.ESOP,
    to: appRoutes.governanceEsop,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.esop" />,
  },
  {
    key: EGovernancePage.EXIT,
    to: appRoutes.governanceExit,
    comingSoon: true,
    label: <FormattedMessage id="governance.title.exit" />,
  },
];
