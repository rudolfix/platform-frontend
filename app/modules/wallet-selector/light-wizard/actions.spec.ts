import { expect } from "chai";
import { spy } from "sinon";
import { dummyNetworkId } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { VaultApi } from "../../../lib/api/vault/VaultApi";
import { noopLogger } from "../../../lib/dependencies/Logger";
import { ObjectStorage } from "../../../lib/persistence/ObjectStorage";
import { TWalletMetadata } from "../../../lib/persistence/WalletMetadataObjectStorage";
import {
  ILightWallet,
  LightWalletConnector,
  LightWalletUtil,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { actions } from "../../actions";
import { walletFlows } from "../flows";
import { WalletStorage } from "./../../../lib/persistence/WalletStorage";

describe("Wallet selector > Light wallet wizard > actions", () => {
  describe("tryConnectingWithLightWallet action", () => {
    const dispatchMock = spy();
    const expectedWalletDummy = { addresses: ["mockAddress"] };
    const walletStorageMock: WalletStorage<TWalletMetadata> = createMock(ObjectStorage, {
      set: () => {},
    }) as any;
    const web3ManagerMock = createMock(Web3Manager, {
      networkId: dummyNetworkId,
      plugPersonalWallet: async () => {},
    });
    const vaultApi = createMock(VaultApi, {
      store: async () => {},
    });
    const lightWalletUtil = createMock(LightWalletUtil, {
      createLightWalletVault: () => {
        return Promise.resolve({ walletInstance: "wallet", salt: "salt" });
      },
      deserializeLightWalletVault: (): Promise<ILightWallet> => {
        const walletInstance = expectedWalletDummy;
        return Promise.resolve(walletInstance as ILightWallet);
      },
      getWalletKeyFromSaltAndPassword: (): Promise<Uint8Array> => {
        return Promise.resolve(new Uint8Array([132, 133]));
      },
      encryptString: (): string => {
        return "test";
      },
    });
    const getStateMock: () => DeepPartial<IAppState> = () => ({
      router: {
        location: {
          pathname: "/eto/login/browser",
        },
      },
    });

    it("should create new wallet and store", async () => {
      const lightWalletConnector = createMock(LightWalletConnector, {
        connect: spy(),
      });

      await walletFlows.tryConnectingWithLightWallet("investor", "test@test.com", "password")(
        dispatchMock,
        web3ManagerMock,
        lightWalletConnector,
        lightWalletUtil,
        walletStorageMock,
        vaultApi,
        noopLogger,
        getStateMock as any,
      );
      expect(lightWalletConnector.connect).to.be.calledWith({
        walletInstance: expectedWalletDummy,
        salt: "salt",
      });
    });

    it("should dispatch error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;
      const lightWalletConnector = createMock(LightWalletConnector, {
        connect: async () => {
          throw new LightWrongPasswordSaltError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
        plugPersonalWallet: async () => {},
      });

      const getStateMock: () => DeepPartial<IAppState> = () => ({
        router: {
          location: {
            pathname: "/eto/login/browser",
          },
        },
      });

      await walletFlows.tryConnectingWithLightWallet("investor", "test@test.com", "password")(
        dispatchMock,
        web3ManagerMock,
        lightWalletConnector,
        lightWalletUtil,
        walletStorageMock,
        vaultApi,
        noopLogger,
        getStateMock as any,
      );

      expect(dispatchMock).to.be.calledWithExactly(
        actions.genericModal.showErrorModal("Password is not correct"),
      );
    });
  });
});

//TODO: change mocks into dummyObjects and put in /fixtures
