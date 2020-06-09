import { toEthereumChecksumAddress } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { expect } from "chai";
import { set } from "lodash";

import {
  calculateParticipation,
  calculateShareholderParticipation,
  convertToProposalDetails,
} from "./utils";

describe("convertToProposalDetails", () => {
  const expectedProposal = {
    createdAt: 1591582503000,
    endsAt: 1592446503000,
    ipfsHash: "Qma7w9sti8z4F1nZDpJC2ZRuKZf8NpCG8YREjDKM6H9A2d",
    startsAt: 1591582503000,
    state: 1,
    title: "General Meeting 2020 Resolution",
    tokenAddress: "0xe39629B8e3e6F42F95EfF73Ab13001fa63529F60",
    votingLegalRep: "0x95137084d1b6F58D177523De894293913394aA12",
  };

  const rawProposal: Parameters<typeof convertToProposalDetails>[0] = [
    new BigNumber("1"),
    "0xe39629b8e3e6f42f95eff73ab13001fa63529f60",
    new BigNumber("6.268341481050607435458823643500602223230975e+42"),
    "0x95137084d1b6f58d177523de894293913394aa12",
    "0x95137084d1b6f58d177523de894293913394aa12",
    new BigNumber("0"),
    new BigNumber("90000000"),
    new BigNumber("22"),
    ("0x47656e6572616c204d656574696e672032303230205265736f6c7574696f6e2c697066733a516d61377739737469387a3446316e5a44704a43325a52754b5a66384e704347385952456a444b4d364839413264" as unknown) as string[],
    false,
    [
      new BigNumber("1591582503"),
      new BigNumber("1591582503"),
      new BigNumber("1592446503"),
      new BigNumber("1592446503"),
      new BigNumber("1593310503"),
    ],
  ];

  it("should properly convert proposal", () => {
    expect(convertToProposalDetails(rawProposal)).to.deep.equal(expectedProposal);
  });

  it("should throw an error if action payload is invalid", () => {
    const rawProposalWithInvalidActionPayload = set(rawProposal, 8, "invalid action payload");

    expect(() => convertToProposalDetails(rawProposalWithInvalidActionPayload)).to.throw();
  });
});

describe("calculateParticipation", () => {
  it("should properly calculate proposal participation", () => {
    const proposalWithJustTally = {
      tally: { against: "2012", inFavor: "4024", tokenVotingPower: "13230000" },
    };

    expect(calculateParticipation(proposalWithJustTally)).to.equal("0.045623582766439909");
  });
});

describe("calculateShareholderParticipation", () => {
  it("should properly calculate proposal participation", () => {
    const proposalWithJustTally = {
      tally: { against: "2012", inFavor: "4024", tokenVotingPower: "13230000" },
    };

    const shareholderVote = {
      address: toEthereumChecksumAddress("0x4A20381D628AEEc776335a89bb32106a8F9d4323"),
      proposalId: "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220",
      state: 2,
      votingPower: "2012",
    };

    expect(calculateShareholderParticipation(shareholderVote, proposalWithJustTally)).to.equal(
      "0.015207860922146636",
    );
  });
});
