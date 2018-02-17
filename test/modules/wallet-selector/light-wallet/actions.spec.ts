import { expect } from "chai";
import { spy } from "sinon";
import { actions } from "../../../../app/modules/actions";
import { UsersApi } from "../../../../app/modules/networking/UsersApi";
import { Storage } from "../../../../app/modules/storage/storage";
import { walletFlows } from "../../../../app/modules/wallet-selector/flows";
import {
  ILightWallet,
  LightWrongPasswordSaltError,
} from "../../../../app/modules/web3/LightWallet";
import { Web3Manager } from "../../../../app/modules/web3/Web3Manager";
import { createMock } from "../../../testUtils";
import { VaultApi } from "./../../../../app/modules/networking/VaultApi";
import { LightWalletConnector, LightWalletUtil } from "./../../../../app/modules/web3/LightWallet";
import { dummyLogger, dummyNetworkId } from "./../../../fixtures";

describe("Wallet selector > Light wallet wizard > actions", () => {
  describe("tryConnectingWithLightWallet action", () => {
    const dispatchMock = spy();
    const expectedWalletDummy = { addresses: ["mockAddress"] };
    const storage = createMock(Storage, { setKey: spy() });
    const web3ManagerMock = createMock(Web3Manager, {
      networkId: dummyNetworkId,
      plugPersonalWallet: async () => {},
    });
    const vaultApi = createMock(VaultApi, {
      store: async () => {},
    });
    const usersApi = createMock(UsersApi, {
      createLightwalletAccount: async () => {},
    });
    const lightWalletUtil = createMock(LightWalletUtil, {
      createLightWalletVault: () => {
        return Promise.resolve({ walletInstance: "wallet", salt: "salt" });
      },
      deserializeLightWalletVault: (): Promise<ILightWallet> => {
        const walletInstance = expectedWalletDummy;
        return Promise.resolve(walletInstance as ILightWallet);
      },
    });

    it("should create new wallet and store", async () => {
      const lightWalletConnector = createMock(LightWalletConnector, {
        connect: spy(),
      });

      await walletFlows.tryConnectingWithLightWallet("test@test.com", "password")(
        dispatchMock,
        web3ManagerMock,
        lightWalletConnector,
        lightWalletUtil,
        storage,
        vaultApi,
        usersApi,
        dummyLogger,
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

      await walletFlows.tryConnectingWithLightWallet("test@test.com", "password")(
        dispatchMock,
        web3ManagerMock,
        lightWalletConnector,
        lightWalletUtil,
        storage,
        vaultApi,
        usersApi,
        dummyLogger,
      );

      expect(dispatchMock).to.be.calledWithExactly(
        actions.wallet.lightWalletConnectionError("Password is not correct"),
      );
    });
  });
});

//TODO: change mocks into dummyObjects and put in /fixtures
