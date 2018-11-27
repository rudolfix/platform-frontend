import {BrowserWalletError} from "../../lib/web3/BrowserWallet";
import {mapSignerErrorToErrorMessage} from "../../lib/web3/errors";
import {LedgerError} from "../../lib/web3/LedgerWallet";
import {LightWalletError} from "../../lib/web3/LightWallet";
import {SignerError} from "../../lib/web3/Web3Manager";
import {EthereumAddress} from "../../types";
import {mapBrowserWalletErrorToErrorMessage} from "../wallet-selector/browser-wizard/errors";
import {mapLedgerErrorToErrorMessage} from "../wallet-selector/ledger-wizard/errors";
import {mapLightWalletErrorToErrorMessage} from "../wallet-selector/light-wizard/errors";
import {ErrorWithData,MismatchedWalletAddressErrorMessage,GenericError } from "../../components/translatedMessages/errorMessages";

export class MismatchedWalletAddressError extends Error {
  constructor(
    public readonly desiredAddress: EthereumAddress,
    public readonly actualAddress: EthereumAddress,
  ) {
    super(
      `Plugged wallet address is: ${actualAddress}, expected wallet address is: ${desiredAddress}`,
    );
  }
}

export function mapSignMessageErrorToErrorMessage(error: Error): ErrorWithData {
  if (error instanceof BrowserWalletError) {
    return { errorType: mapBrowserWalletErrorToErrorMessage(error) };
  }
  if (error instanceof LedgerError) {
    return { errorType: mapLedgerErrorToErrorMessage(error)};
  }
  if (error instanceof LightWalletError) {
    return {errorType: mapLightWalletErrorToErrorMessage(error)};
  }
  if (error instanceof SignerError) {
    return { errorType: mapSignerErrorToErrorMessage(error)};
  }
  if (error instanceof MismatchedWalletAddressError) {
    return { errorType: MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS,
      errorData :{desiredAddress: error.desiredAddress, actualAddress: error.actualAddress}
    };
  }

  return {errorType: GenericError.GENERIC_ERROR};
}
