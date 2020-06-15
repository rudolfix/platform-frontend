import { toEquityTokenSymbol, toEthereumChecksumAddress } from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react";
import React from "react";

import { EProposalState } from "../../../../modules/shareholder-resolutions-voting/module";
import { ProposalVotingBreakdown } from "./ProposalVotingBreakdown";

const proposalTally = {
  inFavor: "0",
  against: "0",
  tokenVotingPower: "13230000",
};

const proposal = {
  title: "General Meeting 2020 Resolution",
  state: EProposalState.Public,
  ipfsHash: "Qma7w9sti8z4F1nZDpJC2ZRuKZf8NpCG8YREjDKM6H9A2d",
  tokenAddress: toEthereumChecksumAddress("0xe39629B8e3e6F42F95EfF73Ab13001fa63529F60"),
  createdAt: 1591582503000,
  startsAt: 1591582503000,
  endsAt: 1592446503000,
  votingContractAddress: toEthereumChecksumAddress("0x88137084d1b6f58d177523de894293913394aa12"),
  companyId: toEthereumChecksumAddress("0x4B07fd23BAA7198061caEd44cF470B0F20cE1b7e"),
  id: "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220",
  tally: proposalTally,
  quorum: "50",
};

storiesOf("Templates|ProposalVotingBreakdown", module).add("default", () => (
  <ProposalVotingBreakdown
    proposal={proposal}
    eto={{ equityTokenSymbol: toEquityTokenSymbol("NOM") }}
  />
));
