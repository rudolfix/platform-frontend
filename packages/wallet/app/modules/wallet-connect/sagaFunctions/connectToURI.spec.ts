import { matchers } from "@neufund/sagas/tests";
import {
  TLibSymbolType,
  setupCoreModule,
  coreModuleApi,
  DevConsoleLogger,
  noopLogger,
} from "@neufund/shared-modules";
import { bootstrapModule } from "@neufund/shared-modules/tests";
import { invariant, toEthereumChecksumAddress } from "@neufund/shared-utils";
import { mocked } from "ts-jest/utils";

import { ESignerType, signerUIModuleApi } from "modules/signer-ui/module";
import { setupStorageModule } from "modules/storage/module";
import { walletConnectActions } from "modules/wallet-connect/actions";
import {
  TSessionDetails,
  WalletConnectAdapter,
} from "modules/wallet-connect/lib/WalletConnectAdapter";
import { privateSymbols } from "modules/wallet-connect/lib/symbols";
import { isValidWalletConnectUri, toWalletConnectUri } from "modules/wallet-connect/lib/utils";
import { setupWalletConnectModule } from "modules/wallet-connect/module";

import { EAppRoutes } from "router/appRoutes";
import { navigate } from "router/routeUtils";

import { createMock } from "utils/testUtils.specUtils";

import { connectEvents } from "./connectEvents";
import { connectToURI } from "./connectToURI";

jest.mock("modules/wallet-connect/lib/utils");
jest.mock("router/routeUtils");

const setupTest = () => {
  const { container, expectSaga } = bootstrapModule([
    setupCoreModule({ backendRootUrl: "" }),
    setupStorageModule(),
    setupWalletConnectModule(),
  ]);

  const walletConnectManager = container.get<
    TLibSymbolType<typeof privateSymbols.walletConnectManager>
  >(privateSymbols.walletConnectManager);

  const loggerMock = createMock(DevConsoleLogger, noopLogger);

  container
    .rebind<TLibSymbolType<typeof coreModuleApi.symbols.logger>>(coreModuleApi.symbols.logger)
    .toConstantValue(loggerMock);

  return {
    walletConnectManager,
    expectSaga,
    logger: loggerMock,
  };
};

describe("wallet-connect - connectToURI", () => {
  const mockURI = toWalletConnectUri(
    "wc:f2b44876-7cbf-4a04-ac82-909525d647d2@1?bridge=https%3A%2F%2Fplatform.neufund.io%2Fapi%2Fwc-bridge-socket%2F&key=d3d0c3ab280886cd52c52051ec2b809e0139f36bab07abaad742bd9abe0e61a2",
  );

  const walletConnectAdapterMock = createMock(WalletConnectAdapter, {});

  const session: TSessionDetails = {
    peer: {
      id: "peer-id",
      meta: {
        name: "Neufund",
        description: "Neufund WC",
        url: "peer-url",
        icons: [],
      },
    },
    approveSession: jest.fn(() => walletConnectAdapterMock),
    rejectSession: jest.fn(),
  };

  const wcSessionRequestPayload = {
    address: toEthereumChecksumAddress("0x0089d53F703f7E0843953D48133f74cE247184c2"),
    chainId: 1,
  };

  const signPayload = {
    type: ESignerType.WC_SESSION_REQUEST as const,
    data: {
      peerId: session.peer.id,
      peerName: session.peer.meta.name,
      peerUrl: session.peer.meta.url,
    },
  };

  it("should connect to URI", async () => {
    const { expectSaga, walletConnectManager } = setupTest();

    mocked(isValidWalletConnectUri).mockImplementation(uri => {
      invariant(uri === mockURI, "Invalid URI passed");

      return true;
    });

    await expectSaga(connectToURI, walletConnectActions.connectToPeer(mockURI))
      .provide([
        [matchers.call.fn(walletConnectManager.createSession), Promise.resolve(session)],
        [matchers.call.fn(connectEvents), undefined],
      ])
      .put(signerUIModuleApi.actions.sign(signPayload))
      .dispatch(
        signerUIModuleApi.actions.signed({
          type: ESignerType.WC_SESSION_REQUEST,
          data: wcSessionRequestPayload,
        }),
      )
      .call(connectEvents, walletConnectAdapterMock)
      .run();

    expect(session.approveSession).toHaveBeenCalledWith(
      wcSessionRequestPayload.chainId,
      wcSessionRequestPayload.address,
    );
    expect(navigate).toHaveBeenCalledWith(EAppRoutes.home);
  });

  it("should not connect to uri given signer denied access", async () => {
    const { expectSaga, walletConnectManager } = setupTest();

    mocked(isValidWalletConnectUri).mockImplementation(uri => {
      invariant(uri === mockURI, "Invalid URI passed");

      return true;
    });

    await expectSaga(connectToURI, walletConnectActions.connectToPeer(mockURI))
      .provide([[matchers.call.fn(walletConnectManager.createSession), Promise.resolve(session)]])
      .put(signerUIModuleApi.actions.sign(signPayload))
      .dispatch(signerUIModuleApi.actions.denied())
      .not.call(connectEvents, walletConnectAdapterMock)
      .run();

    expect(session.rejectSession).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(EAppRoutes.home);
  });
});
