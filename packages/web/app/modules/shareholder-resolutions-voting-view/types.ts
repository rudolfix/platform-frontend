import { TModuleState } from "@neufund/shared-modules";

import { setupShareholderResolutionsVotingViewModule } from "./module";

export type TShareholderResolutionsVotingViewModuleState = TModuleState<
  typeof setupShareholderResolutionsVotingViewModule
>;

export enum EShareholderResolutionProposalViewType {
  VIEW_INVESTOR = "viewInvestor",
  VIEW_ISSUER = "viewIssuer",
}
