import {
  LightCreationError,
  LightDeserializeError,
  LightKeyEncryptError,
  LightSignMessageError,
  LightWalletWrongMnemonic,
  LightWalletWrongPassword,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";

//TODO add translations
export function mapLightWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof LightWrongPasswordSaltError) {
    return "Password is not correct";
  }
  if (e instanceof LightSignMessageError) {
    return "Cannot sign personal message";
  }
  if (e instanceof LightCreationError) {
    return "Cannot create new Light Wallet";
  }
  if (e instanceof LightDeserializeError) {
    return "There was a problem with Vault retrieval";
  }
  if (e instanceof LightKeyEncryptError) {
    return "There was a problem with Light Wallet encryption";
  }
  if (e instanceof LightWalletWrongPassword) {
    return "The password you entered is incorrect. Please try again.";
  }
  if (e instanceof LightWalletWrongMnemonic) {
    return "Something went wrong. Please enter your 24 word recovery and try again.";
  }

  return "Light Wallet is unavailable";
}
