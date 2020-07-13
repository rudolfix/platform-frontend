import { noopLogger, TLibSymbolType } from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { createMock } from "@neufund/shared-utils/tests";
import { Container } from "inversify";

import { testEto } from "../../../../../test/fixtures";
import { symbols } from "../../../../di/symbols";
import { IControllerGovernance } from "../../../../lib/contracts/IControllerGovernance";
import { ITokenControllerHook } from "../../../../lib/contracts/ITokenControllerHook";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { Web3Manager } from "../../../../lib/web3/Web3Manager/Web3Manager";
import { EGovernanceAction } from "../../../governance/types";
import { generatePublishResolutionTransaction } from "./sagas";

describe("Transaction > Governance sagas", () => {
  let container!: Container;
  let contractsService!: ContractsService;
  let expectSaga!: any;

  it("should generate publish resolution transaction", async () => {
    const web3Manager = createMock(Web3Manager, {
      estimateGasWithOverhead: async () => "152634",
    });
    const moduleSetup = bootstrapModule([]);
    container = moduleSetup.container;
    expectSaga = moduleSetup.expectSaga;

    contractsService = createMock(ContractsService, {
      getTokenControllerHook: async () =>
        createMock(ITokenControllerHook, {
          tokenController: Promise.resolve("0xb56f3c996d8a2cce8afc21b24258145d0d5eaa25"),
        }),
      getControllerGovernance: async () =>
        createMock(IControllerGovernance, {
          address: "0xb56f3c996d8a2cce8afc21b24258145d0d5eaa25",
          generalResolutionTx: () =>
            ({
              getData: () =>
                "0x309a2a9b32333461396630306233343730636463353863386430306362333139356266370000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000161000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033697066733a516d546574456d764c736250326f4e6f5a7a4b437767455142534e475469536232396e577375313568336571774700000000000000000000000000",
            } as any),
        }),
    });

    container
      .bind<TLibSymbolType<typeof symbols.logger>>(symbols.logger)
      .toConstantValue(noopLogger);
    container
      .bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .toConstantValue(contractsService);

    container
      .bind<TLibSymbolType<typeof symbols.web3Manager>>(symbols.web3Manager)
      .toConstantValue(web3Manager);

    await expectSaga(
      generatePublishResolutionTransaction,
      "Annual Shareholder Meeting of Nomera Tech",
      EGovernanceAction.COMPANY_NONE,
    )
      .withState({
        web3: {
          connected: false,
          previousConnectedWallet: {
            address: "0x95137084d1b6F58D177523De894293913394aA12",
          },
        },
        etoIssuer: {
          eto: testEto,
        },
        gas: {
          gasPrice: {
            fast: "50000000000",
            fastest: "58000000000",
            safeLow: "43000000000",
            standard: "48000000000",
          },
        },
        investmentFlow: {},
      })
      .returns({
        to: "0xb56f3c996d8a2cce8afc21b24258145d0d5eaa25",
        value: "0",
        data:
          "0x309a2a9b32333461396630306233343730636463353863386430306362333139356266370000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000161000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000033697066733a516d546574456d764c736250326f4e6f5a7a4b437767455142534e475469536232396e577375313568336571774700000000000000000000000000",
        from: "0x95137084d1b6F58D177523De894293913394aA12",
        gasPrice: "48000000000",
        gas: "152634",
      })
      .run();
  });
});
