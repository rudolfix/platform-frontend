import { SagaGenerator } from "@neufund/sagas";
import { matchers } from "@neufund/sagas/tests";
import {
  convertFromUlps,
  convertToUlps,
  divideBigNumbers,
  EthereumAddressWithChecksum,
  multiplyBigNumbers,
  Q18,
  toEthereumChecksumAddress,
} from "@neufund/shared-utils";
import { createMock } from "@neufund/shared-utils/tests";
import BigNumber from "bignumber.js";
import { omit } from "lodash/fp";

import { bootstrapModule } from "../../tests";
import { testCompany, testContract, testEto } from "../../tests/fixtures";
import { TLibSymbolType } from "../../types";
import { createLibSymbol } from "../../utils";
import { EUserType, setupAuthModule } from "../auth/module";
import { bookbuildingModuleApi } from "../bookbuilding/module";
import { contractsModuleApi } from "../contracts/module";
import { ESignerType, IEthManager, ISingleKeyStorage } from "../core/module";
import { investorPortfolioModuleApi } from "../investor-portfolio/module";
import { setupKycModule } from "../kyc/module";
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

const ensurePermissionsArePresentAndRunEffect = function*(): SagaGenerator<void> {
  throw new Error("Not implemented");
};
// eslint-disable-next-line @typescript-eslint/no-empty-function
const waitUntilSmartContractsAreInitialized = function*(): SagaGenerator<void> {};
const displayErrorModalSaga = function*(): SagaGenerator<void> {
  throw new Error("Not implemented");
};

class DummyStorage implements ISingleKeyStorage<string> {
  async clear(): Promise<void> {}
  async get(): Promise<string | undefined> {
    return "foo";
  }
  async set(): Promise<void> {}
}

class DummyEthManager implements IEthManager {
  hasPluggedWallet(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getWalletSignerType(): Promise<ESignerType> {
    return Promise.reject(ESignerType.ETH_SIGN);
  }

  signMessage(message: string): Promise<string> {
    return Promise.resolve(message);
  }

  getWalletAddress(): Promise<EthereumAddressWithChecksum> {
    return Promise.resolve(toEthereumChecksumAddress("0x7824e49353BD72E20B61717cf82a06a4EEE209e8"));
  }
}

describe("loadEtos", () => {
  const jwtStorageSymbol = createLibSymbol<ISingleKeyStorage<string>>("jwtStorageSymbol");
  const ethManagerSymbol = createLibSymbol<IEthManager>("ethManagerSymbol");

  const { expectSaga, container } = bootstrapModule([
    ...setupAuthModule({
      backendRootUrl: "foo",
      jwtStorageSymbol,
      ethManagerSymbol,
      jwtTimingThreshold: 10,
      jwtRefreshThreshold: 10,
    }),
    setupKycModule({
      displayErrorModalSaga,
      ensurePermissionsArePresentAndRunEffect,
      waitUntilSmartContractsAreInitialized,
    }),
    setupEtoModule(),
  ]);

  container
    .rebind<TLibSymbolType<typeof etoModuleApi.symbols.etoApi>>(etoModuleApi.symbols.etoApi)
    .toConstantValue(globalDependencies.apiEtoService);

  container
    .bind<TLibSymbolType<typeof ethManagerSymbol>>(ethManagerSymbol)
    .toConstantValue(createMock(DummyEthManager, {}));

  container
    .bind<TLibSymbolType<typeof jwtStorageSymbol>>(jwtStorageSymbol)
    .toConstantValue(createMock(DummyStorage, {}));

  container
    .bind<TLibSymbolType<typeof contractsModuleApi.symbols.contractsService>>(
      contractsModuleApi.symbols.contractsService,
    )
    .toConstantValue(globalDependencies.contractsService);

  it("should work", async () => {
    await expectSaga(loadEtos)
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

  it("should load investor ticket for investor", async () => {
    await expectSaga(loadEtos)
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

    await expectSaga(loadEtos)
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
