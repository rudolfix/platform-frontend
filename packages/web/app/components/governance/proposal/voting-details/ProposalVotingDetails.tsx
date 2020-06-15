import * as React from "react";

import { shareholderResolutionsVotingModuleApi } from "../../../../modules/shareholder-resolutions-voting/module";
import { TProposal } from "../../../../modules/shareholder-resolutions-voting/types";
import { EPanelPadding, PanelRounded } from "../../../shared/Panel";
import { ProposalVotingBasicDetails } from "./PoposalVotingBasicDetails";

type TExternalProps = { proposal: TProposal };

const ProposalVotingDetails: React.FunctionComponent<TExternalProps> = ({ proposal }) => {
  const participationPercentage = shareholderResolutionsVotingModuleApi.utils.calculateParticipationPercentage(
    proposal,
  );

  return (
    <PanelRounded padding={EPanelPadding.NORMAL}>
      <ProposalVotingBasicDetails
        proposal={proposal}
        participationPercentage={participationPercentage}
      />
    </PanelRounded>
  );
};

export { ProposalVotingDetails };
