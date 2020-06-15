import { matchers } from "@neufund/sagas/tests";
import { noopLogger, TLibSymbolType } from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { toEthereumChecksumAddress } from "@neufund/shared-utils";
import { createMock } from "@neufund/shared-utils/tests";
import BigNumber from "bignumber.js";
import { Container } from "inversify";

import { symbols } from "../../di/symbols";
import { IVotingCenter } from "../../lib/contracts/IVotingCenter";
import { ContractsService } from "../../lib/web3/ContractsService";
import { selectUserId } from "../auth/selectors";
import { actions } from "./actions";
import {
  ProposalNotFoundError,
  ProposalStateNotSupportedError,
  ShareholderHasNoAccessToProposalError,
} from "./errors";
import { IShareholderVote, setupShareholderResolutionsVotingModule } from "./module";
import {
  loadInvestorShareholderResolution,
  loadIssuerShareholderResolution,
  loadProposalEto,
} from "./sagas";
import { EProposalState, EShareholderVoteResolution } from "./types";
import { convertToProposalDetails, convertToProposalTally } from "./utils";

const proposalId = "0x6400a3523bc839d6bad3232d118c4234d9ef6b2408ca6afcadcbff728f06d220";

const userId = "0x8a194c13308326173423119F8dCb785CE14C732B";

const votingCenterContractAddress = "0x88137084d1b6f58d177523de894293913394aa12";
const tokenAddress = "0xe39629B8e3e6F42F95EfF73Ab13001fa63529F60";

const rawProposalDetails: Parameters<typeof convertToProposalDetails>[0] = [
  new BigNumber("1"),
  tokenAddress,
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

const rawProposalTally: Parameters<typeof convertToProposalTally>[0] = [
  new BigNumber("1"),
  new BigNumber("0"),
  new BigNumber("0"),
  new BigNumber("0"),
  new BigNumber("0"),
  new BigNumber("13230000"),
  new BigNumber("103230000"),
  new BigNumber("0"),
  "0x95137084d1b6f58d177523de894293913394aa12",
  false,
];

const equityToken = {
  companyLegalRepresentative: toEthereumChecksumAddress(
    "0x4B07fd23BAA7198061caEd44cF470B0F20cE1b7e",
  ),
};

const equityTokenIssuer = {
  companyLegalRepresentative: toEthereumChecksumAddress(userId),
};

const proposal = {
  ...convertToProposalDetails(rawProposalDetails),
  votingContractAddress: toEthereumChecksumAddress(votingCenterContractAddress),
  companyId: equityToken.companyLegalRepresentative,
  id: proposalId,
  tally: convertToProposalTally(rawProposalTally),
  quorum: "50",
};

const proposalIssuer = {
  ...convertToProposalDetails(rawProposalDetails),
  votingContractAddress: toEthereumChecksumAddress(votingCenterContractAddress),
  companyId: equityTokenIssuer.companyLegalRepresentative,
  id: proposalId,
  tally: convertToProposalTally(rawProposalTally),
  quorum: "50",
};

const shareholderVote: IShareholderVote = {
  proposalId,
  address: toEthereumChecksumAddress(userId),
  state: EShareholderVoteResolution.Abstain,
  votingPower: "1000",
};

describe("shareholder-resolutions-voting sagas", () => {
  let container!: Container;
  let contractsService!: ContractsService;
  let expectSaga!: any;

  beforeEach(() => {
    const upShareholderResolutionsVotingModule = setupShareholderResolutionsVotingModule();

    const moduleSetup = bootstrapModule([upShareholderResolutionsVotingModule]);

    container = moduleSetup.container;
    expectSaga = moduleSetup.expectSaga;

    contractsService = createMock(ContractsService, {
      votingCenter: createMock(IVotingCenter, {
        address: votingCenterContractAddress,
      }),
    });

    container
      .bind<TLibSymbolType<typeof symbols.logger>>(symbols.logger)
      .toConstantValue(noopLogger);
    container
      .bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .toConstantValue(contractsService);
  });

  describe("loadInvestorShareholderResolution", () => {
    it("should load properly investor shareholder resolution", async () => {
      await expectSaga(loadInvestorShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "getVotingPower"], proposalId, userId),
            new BigNumber("1000"),
          ],
          [
            matchers.call([contractsService.votingCenter, "timedProposal"], proposalId),
            rawProposalDetails,
          ],
          [matchers.call([contractsService.votingCenter, "tally"], proposalId), rawProposalTally],
          [
            matchers.call([contractsService.votingCenter, "getVote"], proposalId, userId),
            new BigNumber("0"),
          ],
          [matchers.call([contractsService, "getEquityToken"], tokenAddress), equityToken],
          [matchers.call(loadProposalEto), undefined],
        ])
        .call(loadProposalEto)
        .put(actions.setShareholderResolutionVotingProposal(proposal))
        .put(
          actions.setShareholderResolutionVotingProposalShareholderVote(
            proposalId,
            shareholderVote,
          ),
        )
        .run();
    });

    it("should throw an error when no proposal found for a given id", async () => {
      await expectSaga(loadInvestorShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), false],
        ])
        .throws(ProposalNotFoundError)
        .run();
    });

    it("should throw an error when investor can't vote in a given proposal", async () => {
      await expectSaga(loadInvestorShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "getVotingPower"], proposalId, userId),
            new BigNumber("0"),
          ],
        ])
        .throws(ShareholderHasNoAccessToProposalError)
        .run();
    });

    it("should throw an error when proposal is not in a public state", async () => {
      await expectSaga(loadInvestorShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "getVotingPower"], proposalId, userId),
            new BigNumber("100"),
          ],
          [
            matchers.call([contractsService.votingCenter, "timedProposal"], proposalId),
            [new BigNumber(EProposalState.Final.toString()), ...rawProposalDetails.slice(1)],
          ],
        ])
        .throws(ProposalStateNotSupportedError)
        .run();
    });
  });

  describe("loadIssuerShareholderResolution", () => {
    it("should load properly issuer shareholder resolution", async () => {
      await expectSaga(loadIssuerShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "timedProposal"], proposalId),
            rawProposalDetails,
          ],
          [matchers.call([contractsService.votingCenter, "tally"], proposalId), rawProposalTally],
          [matchers.call([contractsService, "getEquityToken"], tokenAddress), equityTokenIssuer],
          [matchers.call(loadProposalEto), undefined],
        ])
        .call(loadProposalEto)
        .put(actions.setShareholderResolutionVotingProposal(proposalIssuer))
        .run();
    });

    it("should throw an error when no proposal found for a given id", async () => {
      await expectSaga(loadIssuerShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), false],
        ])
        .throws(ProposalNotFoundError)
        .run();
    });

    it("should throw an error when issuer can't view a given proposal", async () => {
      await expectSaga(loadIssuerShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), "0x88137084d1b6f58d177523de894293913394aa12"],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "timedProposal"], proposalId),
            rawProposalDetails,
          ],
          [matchers.call([contractsService.votingCenter, "tally"], proposalId), rawProposalTally],
          [matchers.call([contractsService, "getEquityToken"], tokenAddress), equityTokenIssuer],
        ])
        .throws(ProposalNotFoundError)
        .run();
    });

    it("should throw an error when proposal is not in a public state", async () => {
      await expectSaga(loadIssuerShareholderResolution, proposalId)
        .provide([
          [matchers.select(selectUserId), userId],
          [matchers.call([contractsService.votingCenter, "hasProposal"], proposalId), true],
          [
            matchers.call([contractsService.votingCenter, "timedProposal"], proposalId),
            [new BigNumber(EProposalState.Final.toString()), ...rawProposalDetails.slice(1)],
          ],
        ])
        .throws(ProposalStateNotSupportedError)
        .run();
    });
  });
});
