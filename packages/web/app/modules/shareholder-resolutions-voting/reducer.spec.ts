import { toEthereumChecksumAddress } from "@neufund/shared-utils";
import { expect } from "chai";

import { actions } from "./actions";
import {
  IShareholderResolutionsVotingState,
  shareholderResolutionsVotingInitialState,
  shareholderResolutionsVotingReducer,
} from "./reducer";
import { EShareholderVoteResolution, IShareholderVote } from "./types";

describe("shareholder-resolutions-voting reducer", () => {
  it("should properly set shareholder vote without duplicates", () => {
    const proposalId = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";
    const userId = "0x8a194c13308326173423119F8dCb785CE14C732B";

    const previousShareholderVote = {
      proposalId,
      address: toEthereumChecksumAddress(userId),
      state: EShareholderVoteResolution.InFavor,
      votingPower: "0",
    };

    const state: IShareholderResolutionsVotingState = {
      ...shareholderResolutionsVotingInitialState,
      shareholdersVotes: {
        [userId]: [previousShareholderVote],
      },
    };

    const shareholderVote: IShareholderVote = {
      proposalId,
      address: toEthereumChecksumAddress(userId),
      state: EShareholderVoteResolution.Abstain,
      votingPower: "1000",
    };

    const result = shareholderResolutionsVotingReducer(
      state,
      actions.setShareholderResolutionVotingProposalShareholderVote(proposalId, shareholderVote),
    );

    expect(result).to.deep.eq({
      ...shareholderResolutionsVotingInitialState,
      shareholdersVotes: {
        [userId]: [shareholderVote],
      },
    });
  });
});
