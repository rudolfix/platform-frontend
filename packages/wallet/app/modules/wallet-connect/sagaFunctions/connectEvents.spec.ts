import { Task } from "@neufund/sagas";
import { matchers } from "@neufund/sagas/tests";
import {
  TLibSymbolType,
  setupCoreModule,
  coreModuleApi,
  DevConsoleLogger,
  noopLogger,
  ETxType,
  EJwtPermissions,
} from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { simpleDelay, toEthereumChecksumAddress } from "@neufund/shared-utils";
import { EventEmitter2 } from "eventemitter2";

import { createMock } from "../../../utils/testUtils.specUtils";
import { notificationUIModuleApi } from "../../notification-ui/module";
import { ESignerType, signerUIModuleApi } from "../../signer-ui/module";
import { setupStorageModule } from "../../storage/module";
import { walletConnectActions } from "../actions";
import { WalletConnectAdapter } from "../lib/WalletConnectAdapter";
import { EWalletConnectAdapterEvents } from "../lib/types";
import { setupWalletConnectModule } from "../module";
import { connectEvents, watchWalletConnectEvents } from "./connectEvents";

const setupTest = () => {
  const { container, expectSaga, testSaga } = bootstrapModule([
    setupCoreModule({ backendRootUrl: "" }),
    setupStorageModule(),
    setupWalletConnectModule(),
  ]);

  const loggerMock = createMock(DevConsoleLogger, noopLogger);

  container
    .rebind<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(coreModuleApi.symbols.logger)
    .toConstantValue(loggerMock);

  return {
    expectSaga,
    testSaga,
    logger: loggerMock,
  };
};

describe("wallet-connect - connectEvents", () => {
  const peerId = "wallet-connect-peer-id";
  const peerMeta = {
    name: "Neufund",
    description: "Neufund WC",
    url: "peer-url",
    icons: [],
  };

  const connectedAt = 1596573996215;

  const walletConnectAdapterMock = createMock(WalletConnectAdapter, {
    getPeerId: () => peerId,
    getPeerMeta: () => peerMeta,
    getConnectedAt: () => connectedAt,
  });

  it("should disconnect when event watcher fails", async () => {
    const { expectSaga, logger } = setupTest();

    const error = new Error("Failed to check existing session");

    await expectSaga(connectEvents, walletConnectAdapterMock)
      .provide({
        call(effect, next) {
          if (effect.fn === watchWalletConnectEvents) {
            throw error;
          }

          if (effect.fn === walletConnectAdapterMock.disconnectSession) {
            return undefined;
          }

          return next();
        },
      })
      .put(
        walletConnectActions.connectedToPeer({
          id: peerId,
          meta: peerMeta,
          connectedAt: connectedAt,
        }),
      )
      .call.fn(walletConnectAdapterMock.disconnectSession)
      .put(walletConnectActions.disconnectedFromPeer(peerId))
      .put(notificationUIModuleApi.actions.showInfo("Wallet Connect disconnected"))
      .run();

    expect(logger.error).toHaveBeenCalledWith(error, expect.any(String));
  });

  it("should disconnect when requested", async () => {
    const { expectSaga } = setupTest();

    await expectSaga(connectEvents, walletConnectAdapterMock)
      .provide([
        [matchers.call(watchWalletConnectEvents, walletConnectAdapterMock), undefined],
        [matchers.call([walletConnectAdapterMock, "disconnectSession"]), undefined],
      ])
      .dispatch(walletConnectActions.disconnectFromPeer(peerId))
      .put(
        walletConnectActions.connectedToPeer({
          id: peerId,
          meta: peerMeta,
          connectedAt: connectedAt,
        }),
      )
      .call.fn(walletConnectAdapterMock.disconnectSession)
      .put(walletConnectActions.disconnectedFromPeer(peerId))
      .put(notificationUIModuleApi.actions.showInfo("Wallet Connect disconnected"))
      .run();
  });

  it("should disconnect silently when requested", async () => {
    const { expectSaga } = setupTest();

    await expectSaga(connectEvents, walletConnectAdapterMock)
      .provide([
        [
          matchers.call(watchWalletConnectEvents, walletConnectAdapterMock),
          new Promise(() => {
            // always running saga
          }),
        ],
        [matchers.call([walletConnectAdapterMock, "disconnectSession"]), undefined],
      ])
      .dispatch(walletConnectActions.disconnectFromPeerSilent(peerId))
      .put(
        walletConnectActions.connectedToPeer({
          id: peerId,
          meta: peerMeta,
          connectedAt: connectedAt,
        }),
      )
      .call.fn(walletConnectAdapterMock.disconnectSession)
      .put(walletConnectActions.disconnectedFromPeer(peerId))
      .not.put(notificationUIModuleApi.actions.showInfo("Wallet Connect disconnected"))
      .run();
  });
});

describe("wallet-connect - watchWalletConnectEvents", () => {
  class WalletConnectAdapterMock extends EventEmitter2 {}

  const walletConnectAdapterMock = new WalletConnectAdapterMock() as WalletConnectAdapter;

  const requestMeta = {
    approveRequest: jest.fn(),
    rejectRequest: jest.fn(),
  };

  afterEach(() => jest.resetAllMocks());

  describe("SIGN_MESSAGE", () => {
    const signMessagePayload = {
      digest: "message to sign",
      permission: EJwtPermissions.SUBMIT_KYC_PERMISSION,
    };

    const signedMessagePayload = { signedData: "signed message" };

    it("should handle properly SIGN_MESSAGE event by approving", async () => {
      const { expectSaga } = setupTest();

      const promise = expectSaga(watchWalletConnectEvents, walletConnectAdapterMock)
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SIGN_MESSAGE,
            data: signMessagePayload,
          }),
        )
        .dispatch(
          signerUIModuleApi.actions.signed({
            type: ESignerType.SIGN_MESSAGE,
            data: signedMessagePayload,
          }),
        )
        // duplicate the same effects assertions to make sure that watcher can handle multiple calls
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SIGN_MESSAGE,
            data: signMessagePayload,
          }),
        )
        .dispatch(
          signerUIModuleApi.actions.signed({
            type: ESignerType.SIGN_MESSAGE,
            data: signedMessagePayload,
          }),
        )
        .silentRun();

      walletConnectAdapterMock.emit(
        ESignerType.SIGN_MESSAGE,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await simpleDelay(10);

      walletConnectAdapterMock.emit(
        ESignerType.SIGN_MESSAGE,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await promise;

      expect(requestMeta.approveRequest).toHaveBeenCalledTimes(2);
      expect(requestMeta.approveRequest).toHaveBeenCalledWith(signedMessagePayload.signedData);
    });

    it("should handle properly SIGN_MESSAGE event by denying", async () => {
      const { expectSaga } = setupTest();

      const promise = expectSaga(watchWalletConnectEvents, walletConnectAdapterMock)
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SIGN_MESSAGE,
            data: signMessagePayload,
          }),
        )
        .dispatch(signerUIModuleApi.actions.denied())
        .silentRun();

      walletConnectAdapterMock.emit(
        ESignerType.SIGN_MESSAGE,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await promise;

      expect(requestMeta.rejectRequest).toHaveBeenCalled();
    });
  });

  describe("SEND_TRANSACTION", () => {
    const transaction = {
      to: toEthereumChecksumAddress("0x7824e49353BD72E20B61717cf82a06a4EEE209e8"),
      gasLimit: "0x21000",
      gasPrice: "0x20000000000",
      value: "0x1000000000000000000",
      data: "0x",
    };

    const signMessagePayload = {
      transaction,
      transactionMetaData: {
        transactionType: ETxType.WITHDRAW,
        transactionAdditionalData: {
          amount: "100000000000000000",
          amountEur: "21.059102643554456",
          to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
          tokenDecimals: 18,
          tokenImage: "/images/1b0f8ccf.svg",
          tokenSymbol: "eth",
          total: "104881638400000000",
          totalEur: "22087131884897625449.007104",
        },
      },
    };

    const signedMessagePayload = { transactionHash: "tx hash" };

    it("should handle properly SEND_TRANSACTION event by approving", async () => {
      const { expectSaga } = setupTest();

      const promise = expectSaga(watchWalletConnectEvents, walletConnectAdapterMock)
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SEND_TRANSACTION,
            data: signMessagePayload,
          }),
        )
        .dispatch(
          signerUIModuleApi.actions.signed({
            type: ESignerType.SEND_TRANSACTION,
            data: signedMessagePayload,
          }),
        )
        // duplicate the same effects assertions to make sure that watcher can handle multiple calls
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SEND_TRANSACTION,
            data: signMessagePayload,
          }),
        )
        .dispatch(
          signerUIModuleApi.actions.signed({
            type: ESignerType.SEND_TRANSACTION,
            data: signedMessagePayload,
          }),
        )
        .silentRun();

      walletConnectAdapterMock.emit(
        ESignerType.SEND_TRANSACTION,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await simpleDelay(10);

      walletConnectAdapterMock.emit(
        ESignerType.SEND_TRANSACTION,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await promise;

      expect(requestMeta.approveRequest).toHaveBeenCalledTimes(2);
      expect(requestMeta.approveRequest).toHaveBeenCalledWith(signedMessagePayload.transactionHash);
    });

    it("should handle properly SEND_TRANSACTION event by denying", async () => {
      const { expectSaga } = setupTest();

      const promise = expectSaga(watchWalletConnectEvents, walletConnectAdapterMock)
        .put(
          signerUIModuleApi.actions.sign({
            type: ESignerType.SEND_TRANSACTION,
            data: signMessagePayload,
          }),
        )
        .dispatch(signerUIModuleApi.actions.denied())
        .silentRun();

      walletConnectAdapterMock.emit(
        ESignerType.SEND_TRANSACTION,
        undefined,
        signMessagePayload,
        requestMeta,
      );

      await promise;

      expect(requestMeta.rejectRequest).toHaveBeenCalled();
    });
  });

  describe.only("DISCONNECTED", () => {
    it("should cancel saga", () => {
      const { testSaga } = setupTest();

      testSaga(watchWalletConnectEvents, walletConnectAdapterMock)
        .next()
        .next({ type: EWalletConnectAdapterEvents.DISCONNECTED })
        // typings are not precise here given `cancel` has a default internal task and do not require Task object
        .cancel(("@@redux-saga/SELF_CANCELLATION" as unknown) as Task);
    });
  });
});
