import { callWithCount, delay, takeWithCount, throwError } from "@neufund/sagas";
import { expectSaga, matchers, providers } from "@neufund/sagas/tests";
import { ESignerType, EWalletSubType, EWalletType } from "@neufund/shared-modules";
import {
  EthereumAddressWithChecksum,
  EthereumNetworkId,
  InvariantError,
  toEthereumHDPath,
} from "@neufund/shared-utils";
import { combineReducers } from "redux";

import { dummyEthereumAddressWithChecksum } from "../../../test/fixtures";
import {
  BrowserWalletErrorMessage,
  GenericErrorMessage,
  TestMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { BrowserWalletLockedError } from "../../lib/web3/browser-wallet/BrowserWallet";
import { IVault } from "../../lib/web3/light-wallet/LightWallet";
import { deserializeLightWalletVault } from "../../lib/web3/light-wallet/LightWalletUtils";
import { ITxData, ITxMetadata } from "../../lib/web3/types";
import { Web3Adapter } from "../../lib/web3/Web3Adapter";
import { actions } from "../actions";
import { MessageSignCancelledError } from "../auth/errors";
import { retrieveMetadataFromVaultAPI } from "../wallet-selector/light-wizard/metadata/sagas";
import { MismatchedWalletAddressError } from "./errors";
import { accessWalletReducer, initialState } from "./reducer";
import {
  accessWalletAndRunEffect,
  connectBrowserWallet,
  connectLedger,
  connectLightWallet,
  connectWallet,
  connectWalletConnect,
  ensureWalletConnection,
} from "./sagas";

const testSalt = "4abc08069f8c6d26becd80fe96fbeaf4d17b84cdbe7071a8197ab5370bb85876";
const testEmail = "tesst@example.com";

const testWallet = {
  web3Adapter: Web3Adapter,
  ethereumAddress: dummyEthereumAddressWithChecksum,
  getSignerType: () => ESignerType,
  testConnection: (_: EthereumNetworkId) => async () => true,
  signMessage: (_: string) => async () => "signedMessage",
  sendTransaction: (_1: ITxData, _2: ITxMetadata) => async () => "af908098b968d7564564362c51836",
  isUnlocked: () => true,
  unplug: () => async () => {},
  unlock: (_: string) => async () => {},
};

const ledgerWalletMetadata = {
  walletType: EWalletType.LEDGER,
  walletSubType: EWalletSubType.UNKNOWN,
  derivationPath: toEthereumHDPath("m/44'/60'/0'/0"),
  salt: undefined,
  email: undefined,
  address: dummyEthereumAddressWithChecksum,
} as const;

const testLedgerWallet = {
  ...testWallet,
  walletType: EWalletType.LEDGER,
  walletSubType: EWalletSubType.UNKNOWN,
  getMetadata: () => ledgerWalletMetadata,
};

const browserWalletMetadata = {
  walletType: EWalletType.BROWSER,
  walletSubType: EWalletSubType.METAMASK,
  salt: undefined,
  email: undefined,
  address: dummyEthereumAddressWithChecksum,
};

const testBrowserWallet = {
  ...testWallet,
  walletType: EWalletType.BROWSER,
  walletSubType: EWalletSubType.METAMASK,
  getMetadata: () => browserWalletMetadata,
};

const lightWalletMetadata = {
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
  salt: testSalt,
  email: testEmail,
  address: dummyEthereumAddressWithChecksum,
} as const;

const testLightWallet = {
  ...testWallet,
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
  getMetadata: () => lightWalletMetadata,
};

const wcMetadata = {
  walletType: EWalletType.WALLETCONNECT,
  walletSubType: EWalletSubType.NEUFUND,
  salt: testSalt,
  email: testEmail,
  address: dummyEthereumAddressWithChecksum,
};

const testWcWallet = {
  ...testWallet,
  walletType: EWalletType.WALLETCONNECT,
  walletSubType: EWalletSubType.NEUFUND,
  getMetadata: () => wcMetadata,
};

const invalidMetadata = {
  walletType: "BLA" as EWalletType,
  walletSubType: EWalletSubType.NEUFUND,
  salt: undefined,
  email: undefined,
  address: dummyEthereumAddressWithChecksum,
};

describe("accessWallet sagas", () => {
  describe("ensureWalletConnection", () => {
    it("plugs in and returns the wallet  (wallet already in web3Manager)", async () => {
      const web3ManagerMock = {
        personalWallet: testLedgerWallet,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => ledgerWalletMetadata,
      } as any;

      const ledgerWalletConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        ledgerWalletConnector: ledgerWalletConnectorMock,
      } as TGlobalDependencies)
        .not.call.fn(walletStorage.get)
        .not.call.fn(connectLedger)
        .returns(testLedgerWallet)
        .run();
    });

    it("detects address change", async () => {
      const changedAddress = "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d350" as EthereumAddressWithChecksum;
      const testLedgerWalletChangedAddress = {
        ...testLedgerWallet,
        ethereumAddress: changedAddress,
      };

      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => ledgerWalletMetadata,
      } as any;

      const ledgerWalletConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        ledgerWalletConnector: ledgerWalletConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), ledgerWalletMetadata],
          [matchers.call.fn(connectLedger), testLedgerWalletChangedAddress],
        ])
        .throws(new MismatchedWalletAddressError(ledgerWalletMetadata.address, changedAddress))
        .run();
    });

    it("gets from walletStorage and plugs in ledger", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => ledgerWalletMetadata,
      } as any;

      const ledgerWalletConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        ledgerWalletConnector: ledgerWalletConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), ledgerWalletMetadata],
          [matchers.call.fn(connectLedger), testLedgerWallet],
        ])
        .returns(testLedgerWallet)
        .run();
    });

    it("gets from walletStorage and plugs in browser wallet", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => browserWalletMetadata,
      } as any;

      const browserWalletConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        browserWalletConnector: browserWalletConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), browserWalletMetadata],
          [matchers.call.fn(connectBrowserWallet), testBrowserWallet],
        ])
        .returns(testBrowserWallet)
        .run();
    });

    it("gets from walletStorage and plugs in light wallet", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => lightWalletMetadata,
      } as any;

      const lightWalletConnectorMock = {
        connect: async () => {},
      } as any;

      await expectSaga(
        ensureWalletConnection,
        {
          web3Manager: web3ManagerMock,
          walletStorage: walletStorage,
          lightWalletConnector: lightWalletConnectorMock,
        } as TGlobalDependencies,
        "strongpassword",
      )
        .provide([
          [matchers.call.fn(walletStorage.get), lightWalletMetadata],
          [matchers.call.fn(connectLightWallet), testLightWallet],
        ])
        .returns(testLightWallet)
        .run();
    });

    it("throws if walletType is lightWallet but no password provided (wallet already in web3Manager)", async () => {
      const lockedTestLightWallet = {
        ...testLightWallet,
        isUnlocked: () => false,
      };
      const web3ManagerMock = {
        personalWallet: lockedTestLightWallet,
        plugPersonalWallet: async () => {},
      } as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
      } as TGlobalDependencies)
        .throws(new InvariantError("Light Wallet user without a password"))
        .run();
    });

    it("throws if walletType is lightWallet but no password provided (wallet acquired from walletStorage)", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => lightWalletMetadata,
      } as any;

      const lightWalletConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        lightWalletConnector: lightWalletConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), lightWalletMetadata],
          [matchers.call.fn(connectLightWallet), testLightWallet],
        ])
        .throws(new InvariantError("Light Wallet user without a password"))
        .run();
    });

    it("gets from walletStorage and plugs in walletConnect wallet", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => wcMetadata,
      } as any;

      const walletConnectConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        walletConnectConnector: walletConnectConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), wcMetadata],
          [matchers.call.fn(connectWalletConnect), testWcWallet],
        ])
        .returns(testWcWallet)
        .run();
    });

    it("throws on invalid wallet type", async () => {
      const web3ManagerMock = {
        personalWallet: undefined,
        plugPersonalWallet: async () => {},
      } as any;

      const walletStorage = {
        get: async () => invalidMetadata,
      } as any;

      const walletConnectConnectorMock = {} as any;

      await expectSaga(ensureWalletConnection, {
        web3Manager: web3ManagerMock,
        walletStorage: walletStorage,
        walletConnectConnector: walletConnectConnectorMock,
      } as TGlobalDependencies)
        .provide([
          [matchers.call.fn(walletStorage.get), invalidMetadata],
          [matchers.call.fn(connectWalletConnect), testWcWallet],
        ])
        .throws(new InvariantError("Wallet type unrecognized"))
        .run();
    });
  });

  describe("connectLedger", () => {
    it("connects ledger and returns the wallet object", async () => {
      const ledgerWalletConnector = {
        connect: async () => {},
        finishConnecting: async (_derivationPath: string, _networkId: number) => testLedgerWallet,
      } as any;
      const web3Manager = {
        networkId: 123,
      } as any;

      await expectSaga(connectLedger, ledgerWalletConnector, web3Manager, ledgerWalletMetadata)
        .returns(testLedgerWallet)
        .run();
    });
  });

  describe("connectBrowserWallet", () => {
    it("connects browser wallet and returns the wallet object", async () => {
      const browserWalletConnector = {
        connect: async (_networkId: number) => testBrowserWallet,
      } as any;
      const web3Manager = {
        networkId: 123,
      } as any;

      await expectSaga(connectBrowserWallet, browserWalletConnector, web3Manager)
        .returns(testBrowserWallet)
        .run();
    });
  });

  describe("connectLightWallet", () => {
    it("connects light wallet and returns the wallet object", async () => {
      const lightWalletConnector = {
        connect: async (_lightWalletVault: IVault, _email: string) => testLightWallet,
      } as any;
      const password = "strongpassword";
      const vault = {
        walletType: EWalletType.LIGHT,
        vault: "vaultString",
        salt: testSalt,
        email: testEmail,
      };
      const lightWalletInstance = {
        generateNewAddress: (_pwDerivedKey: any, _n: number) => dummyEthereumAddressWithChecksum,
        serialize: () => "serialized_light_wallet",
        deriveKeyFromPasswordAndSalt: (_password: string, _salt: string, _derkeyLen: number) => [],
        keyFromPassword: (_password: string) => [],
        exportPrivateKey: (_address: string, _pwDerivedKey: Uint8Array) => "my_private_key",
        addresses: [dummyEthereumAddressWithChecksum],
        getSeed: (_pwDerivedKey: Uint8Array) =>
          "mutual mutual phone brief hedgehog friend brown actual candy will tank case phone rather program clap scrap dog trouble phrase fit section snack world",
        passwordProvider: (_callback: any) => {},
        getAddresses: () => [dummyEthereumAddressWithChecksum],
      };

      await expectSaga(connectLightWallet, lightWalletConnector, lightWalletMetadata, password)
        .provide([
          [matchers.call.fn(retrieveMetadataFromVaultAPI), vault],
          [matchers.call.fn(deserializeLightWalletVault), lightWalletInstance],
        ])
        .returns(testLightWallet)
        .run();
    });
  });

  describe("connectWalletConnect", () => {
    it("connects and returns walletConnect object", async () => {
      const walletConnectConnector = {
        connect: async () => testWcWallet,
      } as any;

      await expectSaga(connectWalletConnect, walletConnectConnector)
        .returns(testWcWallet)
        .run();
    });
  });

  describe("connectWallet", () => {
    it("calls 'ensureWalletConnection()' with password as an argument if it's a lightWallet ", async () => {
      const state = {
        web3: {
          connected: true,
          wallet: {
            walletType: EWalletType.LIGHT,
          },
        },
      };

      await expectSaga(connectWallet)
        .withState(state)
        .provide([
          [
            matchers.take(actions.accessWallet.accept),
            {
              type: "ACCESS_WALLET_ACCEPT",
              payload: { password: "strongpassword" },
            },
          ],
          [matchers.call.fn(ensureWalletConnection), testBrowserWallet],
        ])
        .take(actions.accessWallet.accept)
        .call(ensureWalletConnection, undefined, "strongpassword")
        .run();
    });

    it("calls 'ensureWalletConnection()' without arguments if it's not a lightWallet ", async () => {
      const state = {
        web3: {
          connected: true,
          wallet: {
            walletType: EWalletType.BROWSER,
          },
        },
      };

      await expectSaga(connectWallet)
        .withState(state)
        .provide([[matchers.call.fn(ensureWalletConnection), testBrowserWallet]])
        .call(ensureWalletConnection, undefined)
        .run();
    });

    it("rethrows a generic error", async () => {
      const state = {
        web3: {
          connected: true,
          wallet: {
            walletType: EWalletType.BROWSER,
          },
        },
      };

      const error = new Error("ouch!");

      await expectSaga(connectWallet)
        .withState(state)
        .provide([[matchers.call.fn(ensureWalletConnection), providers.throwError(error)]])
        .call(ensureWalletConnection, undefined)
        .put(
          actions.accessWallet.signingError({
            messageType: GenericErrorMessage.GENERIC_ERROR,
            messageData: undefined,
          }),
        )
        .throws(error)
        .run();
    });

    it("on error waits for the user action to restart the wallet access and restarts the loop", async () => {
      const state = {
        web3: {
          connected: true,
          wallet: {
            walletType: EWalletType.BROWSER,
          },
        },
      };

      const error = new BrowserWalletLockedError();
      await expectSaga(connectWallet)
        .withState(state)
        .provide([
          {
            call: callWithCount({
              count: 1,
              expectedFunction: ensureWalletConnection,
              functionReturn: throwError(error),
            }),
            take: takeWithCount({
              count: 1,
              actionCreator: actions.accessWallet.tryToAccessWalletAgain,
              actionPayload: {},
            }),
          },
          [matchers.call.fn(ensureWalletConnection), testBrowserWallet],
        ])
        .call(ensureWalletConnection, undefined)
        .put(
          actions.accessWallet.signingError({
            messageType: BrowserWalletErrorMessage.WALLET_IS_LOCKED,
            messageData: undefined,
          }),
        )
        .take(actions.accessWallet.tryToAccessWalletAgain)
        .call(ensureWalletConnection, undefined)
        .not.take(actions.accessWallet.tryToAccessWalletAgain)
        .run();
    });
  });

  describe("accessWalletAndRunEffect", async () => {
    function* testEffect(): Generator<any, string, any> {
      yield delay(1);
      return "effect_return";
    }

    const title = createMessage(TestMessage.TEST_MESSAGE);
    const message = createMessage(TestMessage.TEST_MESSAGE);
    const inputLabel = createMessage(TestMessage.TEST_MESSAGE);

    it("throws if signing modal is already open", async () => {
      const state = {
        accessWallet: {
          isModalOpen: true,
        },
      };
      await expectSaga(accessWalletAndRunEffect, testEffect(), title, message, inputLabel)
        .withState(state)
        .throws(new Error("Signing already in progress"))
        .run();
    });

    it("shows modal, runs connectWallet(), hides modal, restores initial modal state", async () => {
      const state = {
        accessWallet: initialState,
      };

      await expectSaga(accessWalletAndRunEffect, testEffect(), title, message, inputLabel)
        .withReducer(combineReducers({ accessWallet: accessWalletReducer }) as any, state)
        .provide([[matchers.call(connectWallet), undefined]])
        .put(actions.accessWallet.showAccessWalletModal(title, message, inputLabel))
        .call(connectWallet)
        .put(actions.accessWallet.hideAccessWalletModal())
        .hasFinalState(state)
        .returns("effect_return")
        .run();
    });

    it("throws on closing wallet access modal, restores initial modal state", async () => {
      const state = {
        accessWallet: initialState,
      };

      await expectSaga(accessWalletAndRunEffect, testEffect(), title, message, inputLabel)
        .withReducer(combineReducers({ accessWallet: accessWalletReducer }) as any, state)
        .provide([
          [matchers.call(connectWallet), undefined],
          [
            matchers.take(actions.accessWallet.hideAccessWalletModal),
            {
              type: "HIDE_ACCESS_WALLET_MODAL",
              payload: {},
            },
          ],
        ])
        .put(actions.accessWallet.showAccessWalletModal(title, message, inputLabel))
        .take(actions.accessWallet.hideAccessWalletModal)
        .throws(new MessageSignCancelledError("Wallet access has been cancelled"))
        .hasFinalState(state)
        .not.returns("effect_return")
        .run();
    });
  });
});
