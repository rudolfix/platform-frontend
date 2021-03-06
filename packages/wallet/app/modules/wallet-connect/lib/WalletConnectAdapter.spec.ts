/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ETxType, noopLogger, EJwtPermissions } from "@neufund/shared-modules";
import { toEthereumAddress } from "@neufund/shared-utils";
import WalletConnectMock from "@walletconnect/react-native";
import { EventEmitter2 } from "eventemitter2";

import { UserRejectedRequestError } from "modules/wallet-connect/lib/adapterErrors";

import { mockDate } from "utils/testUtils.specUtils";

import {
  InvalidJSONRPCPayloadError,
  InvalidRPCMethodError,
  WalletConnectAdapter,
} from "./WalletConnectAdapter";
import {
  CALL_REQUEST_EVENT,
  CONNECT_EVENT,
  DISCONNECT_EVENT,
  SESSION_REQUEST_EVENT,
} from "./constants";
import { EWalletConnectAdapterEvents, TWalletConnectAdapterEmit } from "./types";
import { toWalletConnectUri } from "./utils";

const promisifyEvent = <T extends EWalletConnectAdapterEvents>(emitter: EventEmitter2, type: T) =>
  new Promise<Extract<TWalletConnectAdapterEmit, { type: T }>>(resolve => {
    emitter.once(type, (error, payload, meta) => {
      // given that we don't have a proper typings for connected keys
      // for tests purpose we can just force cast
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      resolve({
        type,
        payload,
        meta,
        error,
      } as Extract<TWalletConnectAdapterEmit, { type: T }>);
    });
  });

const mockWalletConnect = <T extends EventEmitter2>(walletConnectInstance: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (WalletConnectMock as any).mockReturnValue(walletConnectInstance);
  return walletConnectInstance;
};

const chainId = 1;

const address = toEthereumAddress("0x8a194c13308326173423119F8dCb785CE14C732B");

const peerData = {
  peerId: "peer id",
  peerMeta: {
    name: "peer name",
    url: "peer url",
  },
};

const sessionRequestJsonRpcCall = {
  id: 1,
  jsonrpc: "2.0",
  method: SESSION_REQUEST_EVENT,
  params: [peerData],
};

class CreateSessionMock extends EventEmitter2 {
  createSession = jest.fn();
}

class ApproveSessionMock extends CreateSessionMock {
  approveSession = jest.fn();
}

class RejectSessionMock extends CreateSessionMock {
  rejectSession = jest.fn();
}

const approveSession = async <T extends ApproveSessionMock>(sessionMock: T) => {
  const mockInstance = mockWalletConnect(sessionMock);

  const wcAdapter = new WalletConnectAdapter({ uri: toWalletConnectUri("mock uri") }, noopLogger);

  setTimeout(() => {
    mockInstance.emit(SESSION_REQUEST_EVENT, undefined, sessionRequestJsonRpcCall);
  }, 1);

  const session = await wcAdapter.connect();
  session.approveSession(chainId, address);

  // emit connect event to connect at date is calculated
  mockInstance.emit(CONNECT_EVENT);

  return { mockInstance, wcAdapter, session };
};

describe("WalletConnectAdapter", () => {
  describe("session creation flow", () => {
    it("should validate session json rpc payload", async () => {
      const mockInstance = mockWalletConnect(new CreateSessionMock());

      const wcAdapter = new WalletConnectAdapter(
        { uri: toWalletConnectUri("mock uri") },
        noopLogger,
      );

      setTimeout(() => {
        mockInstance.emit(SESSION_REQUEST_EVENT, undefined, {
          id: 1,
          jsonrpc: "2.0",
          method: SESSION_REQUEST_EVENT,
          params: [
            {
              foo: "bar",
            },
          ],
        });
      }, 1);

      expect.assertions(1);

      try {
        await wcAdapter.connect();
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidJSONRPCPayloadError);
      }
    });

    it("should reject when there is an error", async () => {
      const mockInstance = mockWalletConnect(new CreateSessionMock());

      const wcAdapter = new WalletConnectAdapter(
        { uri: toWalletConnectUri("mock uri") },
        noopLogger,
      );

      const error = new Error();

      setTimeout(() => {
        mockInstance.emit(SESSION_REQUEST_EVENT, error);
      }, 1);

      expect.assertions(1);

      try {
        await wcAdapter.connect();
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    it("should properly start new session", async () => {
      const { reset } = mockDate(new Date("2019-04-22T10:20:30Z"));

      const { mockInstance, session, wcAdapter } = await approveSession(new ApproveSessionMock());

      expect(session.peer).toEqual({
        id: peerData.peerId,
        meta: peerData.peerMeta,
      });

      expect(mockInstance.approveSession).toHaveBeenCalledWith({ chainId, accounts: [address] });
      expect(wcAdapter.getConnectedAt()).toBe(Date.now());

      reset();
    });

    it("should reject on UI request", async () => {
      const mockInstance = mockWalletConnect(new RejectSessionMock());

      const wcAdapter = new WalletConnectAdapter(
        { uri: toWalletConnectUri("mock uri") },
        noopLogger,
      );

      setTimeout(() => {
        mockInstance.emit(SESSION_REQUEST_EVENT, undefined, sessionRequestJsonRpcCall);
      }, 1);

      const session = await wcAdapter.connect();
      session.rejectSession();

      expect(session.peer).toEqual({
        id: peerData.peerId,
        meta: peerData.peerMeta,
      });
      expect(mockInstance.rejectSession).toHaveBeenCalled();
    });
  });

  describe("message handling flow", () => {
    class ApproveRequestMock extends ApproveSessionMock {
      approveRequest = jest.fn();
    }

    class RejectRequestMock extends ApproveSessionMock {
      rejectRequest = jest.fn();
    }

    it("should reject unsupported methods", async () => {
      const { mockInstance } = await approveSession(new RejectRequestMock());

      const personalSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "personal_sign",
        params: [{ foo: "bar" }],
      };

      mockInstance.emit(CALL_REQUEST_EVENT, undefined, personalSignJsonRpc);

      expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
        id: personalSignJsonRpc.id,
        error: expect.any(InvalidRPCMethodError),
      });
    });

    it("should validate eth_sign method rpc call", async () => {
      const { mockInstance } = await approveSession(new RejectRequestMock());

      const invalidEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sign",
        params: [{ foo: "bar" }],
      };

      mockInstance.emit(CALL_REQUEST_EVENT, undefined, invalidEthSignJsonRpc);

      expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
        id: invalidEthSignJsonRpc.id,
        error: expect.any(InvalidJSONRPCPayloadError),
      });
    });

    it("should approve eth_sign method", async done => {
      const { mockInstance, wcAdapter } = await approveSession(new ApproveRequestMock());

      const signingMessage =
        "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202230396566643035633461643634626165346161356163333036643362343530663436393130323635663931653262643437306332643735333032376634363138222c20227065726d697373696f6e73223a205b226368616e67652d656d61696c225d2c202274696d657374616d70223a20313539353934343930302c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078306531626565353533323838613732373765336461656663363337396266326437636365326265326431393262653862343230386363316636666231373834333732653633313035303037633064353664663134373866346366323435383534227d";
      const signedMessage = "signed message";

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sign",
        params: [address, signingMessage],
      };

      setTimeout(() => {
        mockInstance.emit(CALL_REQUEST_EVENT, undefined, validEthSignJsonRpc);
      }, 1);

      const { payload, meta } = await promisifyEvent(
        wcAdapter,
        EWalletConnectAdapterEvents.SIGN_MESSAGE,
      );

      meta.approveRequest(signedMessage);

      setTimeout(() => {
        expect(payload).toEqual({
          digest: signingMessage,
          permission: EJwtPermissions.CHANGE_EMAIL_PERMISSION,
        });
        expect(mockInstance.approveRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          result: signedMessage,
        });

        done();
      }, 1);
    });

    it("should reject eth_sign method", async done => {
      const { mockInstance, wcAdapter } = await approveSession(new RejectRequestMock());

      const signingMessage =
        "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202230396566643035633461643634626165346161356163333036643362343530663436393130323635663931653262643437306332643735333032376634363138222c20227065726d697373696f6e73223a205b226368616e67652d656d61696c225d2c202274696d657374616d70223a20313539353934343930302c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078306531626565353533323838613732373765336461656663363337396266326437636365326265326431393262653862343230386363316636666231373834333732653633313035303037633064353664663134373866346366323435383534227d";

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sign",
        params: [address, signingMessage],
      };

      setTimeout(() => {
        mockInstance.emit(CALL_REQUEST_EVENT, undefined, validEthSignJsonRpc);
      }, 1);

      const { payload, meta } = await promisifyEvent(
        wcAdapter,
        EWalletConnectAdapterEvents.SIGN_MESSAGE,
      );

      meta.rejectRequest(new Error("User rejected request"));

      setTimeout(() => {
        expect(payload).toEqual({
          digest: signingMessage,
          permission: EJwtPermissions.CHANGE_EMAIL_PERMISSION,
        });
        expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          error: expect.any(Error),
        });

        done();
      }, 1);
    });

    it("should automatically reject eth_sign method for too many permissions", async done => {
      const { mockInstance } = await approveSession(new RejectRequestMock());

      const signingMessage =
        "0x7b2261646472657373223a2022307866413141663245323531656537333946383365313464376461436664373742336430453933306237222c202273616c74223a202230396566643035633461643634626165346161356163333036643362343530663436393130323635663931653262643437306332643735333032376634363138222c20227065726d697373696f6e73223a205b226368616e67652d656d61696c222c2022646f2d626f6f6b6275696c64696e67225d2c202274696d657374616d70223a20313539353934343930302c20227369676e65725f74797065223a20226574685f7369676e222c20226d6163223a20223078306531626565353533323838613732373765336461656663363337396266326437636365326265326431393262653862343230386363316636666231373834333732653633313035303037633064353664663134373866346366323435383534227d";

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sign",
        params: [address, signingMessage],
      };

      setTimeout(() => {
        mockInstance.emit("call_request", undefined, validEthSignJsonRpc);
      }, 1);

      setTimeout(() => {
        expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          error: expect.any(Error),
        });

        done();
      }, 1);
    });

    it("should validate eth_sendTypedTransaction method rpc call", async () => {
      const { mockInstance } = await approveSession(new RejectRequestMock());

      const invalidEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sendTypedTransaction",
        params: [{ foo: "bar" }],
      };

      mockInstance.emit(CALL_REQUEST_EVENT, undefined, invalidEthSignJsonRpc);

      expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
        id: invalidEthSignJsonRpc.id,
        error: expect.any(InvalidJSONRPCPayloadError),
      });
    });

    it("should strip unknown properties and approve eth_sendTypedTransaction method", async done => {
      const { mockInstance, wcAdapter } = await approveSession(new ApproveRequestMock());

      const transactionHash = "tx hash";

      const transaction = {
        to: "0x7824e49353BD72E20B61717cf82a06a4EEE209e8",
        gas: "0x21000",
        gasPrice: "0x20000000000",
        value: "0x1000000000000000000",
        data: "0x",
      };

      const transactionFromRpc = {
        ...transaction,
        foo: "bar",
        quiz: "baz",
      };

      const transactionMetaData = {
        transactionAdditionalData: {},
        transactionType: ETxType.WITHDRAW,
      };

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sendTypedTransaction",
        params: [transactionFromRpc, transactionMetaData],
      };

      setTimeout(() => {
        mockInstance.emit(CALL_REQUEST_EVENT, undefined, validEthSignJsonRpc);
      }, 1);

      const { payload, meta } = await promisifyEvent(
        wcAdapter,
        EWalletConnectAdapterEvents.SEND_TRANSACTION,
      );

      meta.approveRequest(transactionHash);

      setTimeout(() => {
        const expectedTransaction = {
          transaction: {
            ...transaction,
            // should rename `gas` to `gasLimit`
            gasLimit: transaction.gas,
            gas: undefined,
          },
          transactionMetaData,
        };
        expect(payload).toEqual(expectedTransaction);

        expect(mockInstance.approveRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          result: transactionHash,
        });

        done();
      }, 1);
    });

    it("should reject eth_sendTypedTransaction method", async done => {
      const { mockInstance, wcAdapter } = await approveSession(new RejectRequestMock());

      const transaction = {
        to: "0x7824e49353BD72E20B61717cf82a06a4EEE209e8",
        gas: "0x21000",
        gasPrice: "0x20000000000",
        value: "0x1000000000000000000",
        data: "0x",
      };

      const transactionMetaData = {
        transactionAdditionalData: {},
        transactionType: ETxType.WITHDRAW,
      };

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sendTypedTransaction",
        params: [transaction, transactionMetaData],
      };
      setTimeout(() => {
        mockInstance.emit(CALL_REQUEST_EVENT, undefined, validEthSignJsonRpc);
      }, 1);

      const { payload, meta } = await promisifyEvent(
        wcAdapter,
        EWalletConnectAdapterEvents.SEND_TRANSACTION,
      );

      meta.rejectRequest(new UserRejectedRequestError());

      setTimeout(() => {
        const expectedTransaction = {
          transaction: {
            ...transaction,
            gasLimit: transaction.gas,
            gas: undefined,
          },
          transactionMetaData,
        };
        expect(payload).toEqual(expectedTransaction);

        expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          error: expect.any(Error),
        });

        done();
      }, 1);
    });

    it("should reject deprecated eth_sendTransaction method", async done => {
      const { mockInstance } = await approveSession(new RejectRequestMock());

      const transaction = {
        to: "0x7824e49353BD72E20B61717cf82a06a4EEE209e8",
        gasLimit: "0x21000",
        gasPrice: "0x20000000000",
        value: "0x1000000000000000000",
        data: "0x",
      };

      const validEthSignJsonRpc = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_sendTransaction",
        params: [transaction],
      };
      setTimeout(() => {
        mockInstance.emit(CALL_REQUEST_EVENT, undefined, validEthSignJsonRpc);
      }, 1);

      setTimeout(() => {
        expect(mockInstance.rejectRequest).toHaveBeenCalledWith({
          id: validEthSignJsonRpc.id,
          error: expect.any(Error),
        });

        done();
      }, 1);
    });
  });

  describe("disconnect flow", () => {
    it("should emit disconnected even on client request", async () => {
      const { mockInstance, wcAdapter } = await approveSession(new ApproveSessionMock());

      setTimeout(() => {
        mockInstance.emit(DISCONNECT_EVENT);
      }, 1);

      const result = await promisifyEvent(wcAdapter, EWalletConnectAdapterEvents.DISCONNECTED);

      expect(result).toEqual({
        error: undefined,
        meta: undefined,
        payload: undefined,
        type: "disconnected",
      });
    });

    it("should disconnect on ui request", async () => {
      class KillSessionMock extends ApproveSessionMock {
        killSession = jest.fn();
      }

      const { mockInstance, wcAdapter } = await approveSession(new KillSessionMock());

      await wcAdapter.disconnectSession();
      expect(mockInstance.killSession).toHaveBeenCalled();
    });
  });
});
