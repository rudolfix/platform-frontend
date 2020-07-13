import { noopLogger, TLibSymbolType } from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { createMock } from "@neufund/shared-utils/tests";
import BigNumber from "bignumber.js";
import { Container } from "inversify";

import { testEto } from "../../../test/fixtures";
import { symbols } from "../../di/symbols";
import { IControllerGovernance } from "../../lib/contracts/IControllerGovernance";
import { ITokenControllerHook } from "../../lib/contracts/ITokenControllerHook";
import { ContractsService } from "../../lib/web3/ContractsService";
import { actions as globalActions } from "../actions";
import { actions } from "./actions";
import { GOVERNANCE_CONTRACT_ID } from "./constants";
import { loadGeneralInformationView } from "./sagas";
import { EGovernanceAction } from "./types";

const TOKEN_CONTROLLER = "0xb56f3c996d8a2cce8afc21b24258145d0d5eaa25";

describe("Governance > General information sagas", () => {
  let container!: Container;
  let contractsService!: ContractsService;
  let expectSaga!: any;
  let moduleSetup: any;

  beforeEach(() => {
    moduleSetup = bootstrapModule([]);
    container = moduleSetup.container;
    expectSaga = moduleSetup.expectSaga;

    container
      .bind<TLibSymbolType<typeof symbols.logger>>(symbols.logger)
      .toConstantValue(noopLogger);
  });

  it("Go to dashboard if governance is not visible", async () => {
    contractsService = createMock(ContractsService, {});

    container
      .bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .toConstantValue(contractsService);

    await expectSaga(loadGeneralInformationView)
      .withState({
        governance: {
          tabVisible: false,
        },
        etoIssuer: {
          eto: testEto,
        },
      })
      .put(globalActions.routing.goToDashboard())
      .run();
  });

  it("Go to dashboard if incompatible", async () => {
    contractsService = createMock(ContractsService, {
      getTokenControllerHook: async () =>
        createMock(ITokenControllerHook, {
          tokenController: Promise.resolve(TOKEN_CONTROLLER),
        }),
      getControllerGovernance: async () =>
        createMock(IControllerGovernance, {
          contractId: async () => ["wrongContractId", new BigNumber("0")],
        }),
    });

    container
      .bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .toConstantValue(contractsService);

    await expectSaga(loadGeneralInformationView)
      .withState({
        governance: {
          tabVisible: true,
        },
        etoIssuer: {
          eto: testEto,
        },
      })
      .put(globalActions.routing.goToDashboard())
      .run();
  });

  it("Load resolutions", async () => {
    contractsService = createMock(ContractsService, {
      getTokenControllerHook: async () =>
        createMock(ITokenControllerHook, {
          tokenController: Promise.resolve(TOKEN_CONTROLLER),
        }),
      getControllerGovernance: async () =>
        createMock(IControllerGovernance, {
          contractId: async () => [GOVERNANCE_CONTRACT_ID, new BigNumber("0")],
          resolutionsList: Promise.resolve([
            "0x642f1abab6a3bf50045490997b35edc3578372c994e8111062968205c0cd1a59",
            "0x57cd9bf3f51b148c4b1e353719485a92f81ffcc3824a9b628446b0f4e4f01a6b",
          ]),
          resolution: async () => [
            new BigNumber("4"),
            new BigNumber("0"),
            new BigNumber("1587219468"),
            new BigNumber("0"),
            "",
            "",
            "",
            new BigNumber("0"),
            new BigNumber("0"),
          ],
        }),
    });

    container
      .bind<TLibSymbolType<typeof symbols.contractsService>>(symbols.contractsService)
      .toConstantValue(contractsService);

    await expectSaga(loadGeneralInformationView)
      .withState({
        governance: {
          tabVisible: true,
        },
        etoIssuer: {
          eto: testEto,
        },
      })
      .put(
        actions.setGovernanceResolutions([
          {
            action: EGovernanceAction.COMPANY_NONE,
            id: "0x642f1abab6a3bf50045490997b35edc3578372c994e8111062968205c0cd1a59",
            draft: false,
            startedAt: new Date("2020-04-18T14:17:48.000Z"),
          },
          {
            action: EGovernanceAction.COMPANY_NONE,
            id: "0x57cd9bf3f51b148c4b1e353719485a92f81ffcc3824a9b628446b0f4e4f01a6b",
            draft: false,
            startedAt: new Date("2020-04-18T14:17:48.000Z"),
          },
        ]),
      )
      .run();
  });
});
