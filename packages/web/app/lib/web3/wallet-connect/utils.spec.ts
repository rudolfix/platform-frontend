import { expect } from "chai";

import { ESignerType } from "../../../../../shared-modules/dist/modules/core/lib/eth/types";
import {
  WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
  WC_DEFAULT_SIGN_TIMEOUT,
} from "../../../config/constants";
import { EWalletSubType, TWcWalletSubtypes } from "../../../modules/web3/types";
import { ESignTransactionMethod } from "../types";
import { generateWalletMetaFormPeerMeta } from "./utils";

describe("peerMeta to walletMeta", () => {
  it("default", () => {
    const peerMeta = null;
    const expectedWalletMeta = {
      walletSubType: EWalletSubType.UNKNOWN as TWcWalletSubtypes,
      sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
      signerType: ESignerType.ETH_SIGN,
      signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
      sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
      supportsExplicitTimeouts: false,
      supportSessionPings: false,
      supportsRemoteKyc: false,
      supportsWalletMigration: false,
    };
    expect(generateWalletMetaFormPeerMeta(peerMeta)).to.be.deep.eq(expectedWalletMeta);
  });

  it("metamask", () => {
    const peerMeta = {
      description: "I'm Metamask",
      url: "https://666.com",
      icons: [],
      name: "Metamask",
    };

    const expectedWalletMeta = {
      walletSubType: EWalletSubType.METAMASK as TWcWalletSubtypes,
      sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
      signerType: ESignerType.ETH_SIGN_TYPED_DATA,
      signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
      sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
      supportsExplicitTimeouts: false,
      supportSessionPings: false,
      supportsRemoteKyc: false,
      supportsWalletMigration: false,
    };
    expect(generateWalletMetaFormPeerMeta(peerMeta)).to.be.deep.eq(expectedWalletMeta);
  });

  it("neufund", () => {
    const peerMeta = {
      description: "I'm Neufund",
      url: "https://neufund.org",
      icons: [],
      name: "Neufund",
    };

    const expectedWalletMeta = {
      walletSubType: EWalletSubType.NEUFUND as TWcWalletSubtypes,
      sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
      signerType: ESignerType.ETH_SIGN,
      signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
      sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
      supportsExplicitTimeouts: true,
      supportSessionPings: true,
      supportsRemoteKyc: true,
      supportsWalletMigration: true,
    };
    expect(generateWalletMetaFormPeerMeta(peerMeta)).to.be.deep.eq(expectedWalletMeta);
  });

  it("everything else", () => {
    const peerMeta = {
      description: "I don't know who I am",
      url: "https://666.org",
      icons: [],
      name: "Blabla",
    };

    const expectedWalletMeta = {
      walletSubType: EWalletSubType.UNKNOWN as TWcWalletSubtypes,
      sendTransactionMethod: ESignTransactionMethod.ETH_SEND_TRANSACTION,
      signerType: ESignerType.ETH_SIGN,
      signingTimeout: WC_DEFAULT_SIGN_TIMEOUT,
      sessionRequestTimeout: WC_DEFAULT_SESSION_REQUEST_TIMEOUT,
      supportsExplicitTimeouts: false,
      supportSessionPings: false,
      supportsRemoteKyc: false,
      supportsWalletMigration: false,
    };
    expect(generateWalletMetaFormPeerMeta(peerMeta)).to.be.deep.eq(expectedWalletMeta);
  });
});
