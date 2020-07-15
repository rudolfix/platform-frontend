import { matchers } from "@neufund/sagas/tests";
import {
  convertFromUlps,
  convertToUlps,
  divideBigNumbers,
  multiplyBigNumbers,
  Q18,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import { omit } from "lodash/fp";

import { bootstrapModule } from "../../tests";
import { testCompany, testContract, testEto } from "../../tests/fixtures";
import { TLibSymbolType } from "../../types";
import { EUserType } from "../auth/module";
import { bookbuildingModuleApi } from "../bookbuilding/module";
import { contractsModuleApi } from "../contracts/module";
import { coreModuleApi } from "../core/module";
import { investorPortfolioModuleApi } from "../investor-portfolio/module";
import { etoActions } from "./actions";
import { etoModuleApi, setupEtoModule } from "./module";
import { loadEtos } from "./sagas";
import { EETOStateOnChain, TEtoContractData } from "./types";

const tokenData = {
  balanceUlps: new BigNumber("123"),
  balanceDecimals: 0,
  tokensPerShare: new BigNumber("1"),
  totalCompanyShares: new BigNumber("112"),
  companyValuationEurUlps: new BigNumber("123"),
};

const commitmentContractData = {
  timedState: new BigNumber(testContract.timedState.toString()),
  totalInvestment: () => [
    new BigNumber(convertToUlps(testContract.totalInvestment.totalEquivEur.toString())),
    new BigNumber(testContract.totalInvestment.totalTokensInt.toString()),
    new BigNumber(testContract.totalInvestment.totalInvestors.toString()),
  ],
  startOfStates: [
    new BigNumber("0"),
    new BigNumber(testContract.startOfStates[1].getTime().toString()).div("1000"),
    new BigNumber(testContract.startOfStates[2].getTime().toString()).div("1000"),
    new BigNumber(testContract.startOfStates[3].getTime().toString()).div("1000"),
    new BigNumber(testContract.startOfStates[4].getTime().toString()).div("1000"),
    new BigNumber(testContract.startOfStates[5].getTime().toString()).div("1000"),
    new BigNumber("0"),
  ],
  equityToken: testContract.equityTokenAddress,
  etoTerms: testContract.etoTermsAddress,
};

const globalDependencies = {
  logger: {
    info: (_: string) => {},
    error: (_: string) => {},
  },
  notificationCenter: {
    error: (_: string) => {},
  },
  apiEtoService: {
    getEtos: (_: string) => [testEto],
  },
  contractsService: {
    getEquityToken: (_: string) => ({
      balanceOf: (_1: string) => tokenData.balanceUlps,
      decimals: tokenData.balanceDecimals,
      tokensPerShare: tokenData.tokensPerShare,
      tokenController: "",
      shareNominalValueUlps: new BigNumber("123"),
    }),
    getControllerGovernance: (_: string) => ({
      shareholderInformation: () => [
        tokenData.totalCompanyShares,
        tokenData.companyValuationEurUlps,
      ],
    }),
    getTokenController: (_: string) => ({
      onTransfer: (_1: string, _2: string, _3: string, _4: BigNumber) => true,
    }),
    getETOCommitmentContract: (_: string) => commitmentContractData,
    etherToken: {
      balanceOf: (_: string) => new BigNumber(testContract.totalInvestment.etherTokenBalance),
    },
    euroToken: {
      balanceOf: (_: string) => new BigNumber(testContract.totalInvestment.euroTokenBalance),
    },
  },
} as any;

const etosByPreviewCode = {
  [testEto.previewCode]: omit("company", testEto),
};

describe("loadEtos", () => {
  const { expectSaga, container } = bootstrapModule([setupEtoModule()]);

  container
    .bind<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(coreModuleApi.symbols.logger)
    .toConstantValue(globalDependencies.logger);

  container
    .rebind<TLibSymbolType<typeof etoModuleApi.symbols.etoApi>>(etoModuleApi.symbols.etoApi)
    .toConstantValue(globalDependencies.apiEtoService);

  container
    .bind<TLibSymbolType<typeof contractsModuleApi.symbols.contractsService>>(
      contractsModuleApi.symbols.contractsService,
    )
    .toConstantValue(globalDependencies.contractsService);

  it("should work", async () => {
    await expectSaga(loadEtos, globalDependencies)
      .withState({
        kyc: {
          individualData: {
            country: undefined,
          },
        },
        auth: {},
        user: {
          data: {
            type: EUserType.ISSUER,
          },
        },
      })
      .put(bookbuildingModuleApi.actions.loadBookBuildingListStats([testEto.etoId]))
      .put(
        etoActions.setEtoDataFromContract(
          testEto.previewCode,
          testEto.contract as TEtoContractData,
        ),
      )
      // Should not load investor ticket for not INVESTOR user type
      .not.put(investorPortfolioModuleApi.actions.loadInvestorTickets(etosByPreviewCode))
      .put(
        etoActions.setEtos({
          etos: etosByPreviewCode,
          companies: { [testCompany.companyId]: testEto.company },
        }),
      )
      .put(etoActions.setEtosDisplayOrder([testEto.previewCode]))
      .run();
  });

  it("should load investor ticket for investor", () => {
    expectSaga(loadEtos, globalDependencies)
      .provide([[matchers.getContext("deps"), globalDependencies]])
      .withState({
        kyc: {
          individualData: {
            country: undefined,
          },
        },
        auth: {},
        user: {
          data: {
            type: EUserType.INVESTOR,
          },
        },
      })
      .put(bookbuildingModuleApi.actions.loadBookBuildingListStats([testEto.etoId]))
      .put(
        etoActions.setEtoDataFromContract(
          testEto.previewCode,
          testEto.contract as TEtoContractData,
        ),
      )
      .put(investorPortfolioModuleApi.actions.loadInvestorTickets(etosByPreviewCode))
      .put(
        etoActions.setEtos({
          etos: etosByPreviewCode,
          companies: { [testCompany.companyId]: testEto.company },
        }),
      )
      .put(etoActions.setEtosDisplayOrder([testEto.previewCode]))
      .run();
  });

  it("should load token data for investor with eto in claim state", async () => {
    const claimedContractsServices = {
      ...globalDependencies.contractsService,
      getETOCommitmentContract: (_: string) => ({
        ...commitmentContractData,
        timedState: new BigNumber(EETOStateOnChain.Claim.toString()),
      }),
    };

    container
      .rebind<TLibSymbolType<typeof contractsModuleApi.symbols.contractsService>>(
        contractsModuleApi.symbols.contractsService,
      )
      .toConstantValue(claimedContractsServices);

    const etoInClaim = {
      ...testEto,
      contract: {
        ...testEto.contract,
        timedState: EETOStateOnChain.Claim,
      },
    };

    const tokenDataProcessed = {
      balanceUlps: tokenData.balanceUlps.toString(),
      balanceDecimals: tokenData.balanceDecimals,
      tokensPerShare: tokenData.tokensPerShare.toString(),
      companyValuationEurUlps: tokenData.companyValuationEurUlps.toString(),
      totalCompanyShares: convertToUlps(tokenData.totalCompanyShares).toString(),
      tokenPrice: convertFromUlps(
        new BigNumber(
          divideBigNumbers(
            divideBigNumbers(
              multiplyBigNumbers([tokenData.companyValuationEurUlps, new BigNumber("123")]),
              tokenData.totalCompanyShares.mul(Q18),
            ),
            tokenData.tokensPerShare,
          ),
        ),
      ).toString(),
      canTransferToken: true,
    };

    expectSaga(loadEtos, globalDependencies)
      .withState({
        kyc: {
          individualData: {
            country: undefined,
          },
        },
        auth: {},
        user: {
          data: {
            type: EUserType.INVESTOR,
            userId: "0xf7784a74cc59d1e6e1c10ca2053f34d68d280ae7",
          },
        },
        web3: {
          connected: true,
          wallet: {
            address: "0xf7784a74cc59d1e6e1c10ca2053f34d68d280ae7",
          },
        },
      })
      .put(bookbuildingModuleApi.actions.loadBookBuildingListStats([etoInClaim.etoId]))
      .put(
        etoActions.setEtoDataFromContract(
          etoInClaim.previewCode,
          etoInClaim.contract as TEtoContractData,
        ),
      )
      .put(investorPortfolioModuleApi.actions.loadInvestorTickets(etosByPreviewCode))
      .put(etoActions.setTokenData(etoInClaim.previewCode, tokenDataProcessed))
      .put(etoActions.setTokensLoadingDone())
      .put(
        etoActions.setEtos({
          etos: etosByPreviewCode,
          companies: { [testCompany.companyId]: testEto.company },
        }),
      )
      .put(etoActions.setEtosDisplayOrder([testEto.previewCode]))
      .run();
  });
});
