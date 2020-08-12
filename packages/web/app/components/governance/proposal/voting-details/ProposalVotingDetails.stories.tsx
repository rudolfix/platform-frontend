import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import { toEthereumChecksumAddress } from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react";
import React from "react";

import { EProposalState } from "../../../../modules/shareholder-resolutions-voting/module";
import {
  ENomineeVote,
  ITokenHolderBreakdown,
} from "../../../../modules/shareholder-resolutions-voting/types";
import { ProposalVotingDetails } from "./ProposalVotingDetails";

const proposalTally = {
  inFavor: "0",
  against: "0",
  tokenVotingPower: "13230000",
  offchainInFavor: "0",
  offchainAgainst: "0",
  totalVotingPower: "20000000",
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

const tokenHolderBreakdown = {
  inFavorPercentage: "0",
  inFavor: "0",
  againstPercentage: "0",
  against: "0",
  abstainPercentage: "0",
  abstain: "0",
  totalTokens: "0",
  nomineeVote: ENomineeVote.AGAINST,
  decimals: 0,
  tokenSymbol: "B",
  nomineeName: "H",
};

const eto = { shareCapitalCurrencyCode: "EUR" };

const breakdown = {
  resolutionPassed: true,
  shareCapitalInFavor: "0",
  shareCapitalAgainst: "0",
  shareCapitalAbstain: "0",
  offChainVoteDocumentUri: "0",
};

storiesOf("Templates|ProposalVotingDetails", module).add("default", () => (
  <ProposalVotingDetails
    proposal={proposal}
    nomineeShareBreakdown={tokenHolderBreakdown as ITokenHolderBreakdown}
    eto={eto as TEtoWithCompanyAndContract}
    shareCapitalBreakdown={breakdown}
    downloadDocument={() => {}}
    pendingDownloads={{}}
  />
));
