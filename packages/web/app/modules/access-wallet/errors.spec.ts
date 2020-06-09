import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { expect } from "chai";

import { dummyEthereumAddressWithChecksum } from "../../../test/fixtures";
import {
  BrowserWalletErrorMessage,
  LedgerErrorMessage,
  LightWalletErrorMessage,
  MismatchedWalletAddressErrorMessage,
  SignerErrorMessage,
} from "../../components/translatedMessages/messages";
import { BrowserWalletMissingError } from "../../lib/web3/browser-wallet/BrowserWallet";
import { LedgerConfirmationRejectedError } from "../../lib/web3/ledger-wallet/errors";
import { LightSignMessageError } from "../../lib/web3/light-wallet/LightWallet";
import { SignerRejectConfirmationError } from "../../lib/web3/Web3Manager/Web3Manager";
import { mapSignMessageErrorToErrorMessage, MismatchedWalletAddressError } from "./errors";

describe("access-wallet error message mappers", () => {
  it("correctly maps MismatchedWalletAddressError", () => {
    const actualAddress = "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d350" as EthereumAddressWithChecksum;

    const error = new MismatchedWalletAddressError(dummyEthereumAddressWithChecksum, actualAddress);
    const errorMessage = mapSignMessageErrorToErrorMessage(error);

    expect(errorMessage).to.be.deep.eq({
      messageType: MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS,
      messageData: {
        actualAddress,
        desiredAddress: dummyEthereumAddressWithChecksum,
      },
    });
  });

  it("calls mapBrowserWalletErrorToErrorMessage() on BrowserWalletError", () => {
    const error = new BrowserWalletMissingError();
    const errorMessage = mapSignMessageErrorToErrorMessage(error);

    expect(errorMessage).to.be.deep.eq({
      messageType: BrowserWalletErrorMessage.WALLET_NOT_ENABLED,
      messageData: undefined,
    });
  });

  it("calls mapLedgerErrorToErrorMessage() on LedgerError", () => {
    const error = new LedgerConfirmationRejectedError();
    const errorMessage = mapSignMessageErrorToErrorMessage(error);

    expect(errorMessage).to.be.deep.eq({
      messageType: LedgerErrorMessage.GENERIC_ERROR,
      messageData: undefined,
    });
  });

  it("calls mapLightWalletErrorToErrorMessage() on LightWalletError", () => {
    const error = new LightSignMessageError();
    const errorMessage = mapSignMessageErrorToErrorMessage(error);

    expect(errorMessage).to.be.deep.eq({
      messageType: LightWalletErrorMessage.SIGN_MESSAGE,
      messageData: undefined,
    });
  });

  it("calls mapSignerErrorToErrorMessage() on SignerError", () => {
    const error = new SignerRejectConfirmationError();
    const errorMessage = mapSignMessageErrorToErrorMessage(error);

    expect(errorMessage).to.be.deep.eq({
      messageType: SignerErrorMessage.CONFIRMATION_REJECTED,
      messageData: undefined,
    });
  });
});
