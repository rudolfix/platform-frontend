import {
  LightCreationError,
  LightKeyEncryptError,
  LightSignMessageError,
  LightWalletWrongMnemonic,
  LightWalletWrongPassword,
} from "../../../lib/web3/LightWallet";
import {
  LightDeserializeError,
  LightWrongPasswordSaltError,
} from "./../../../lib/web3/LightWallet";

export function mapLightWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof LightWrongPasswordSaltError) {
    return "Password is not correct";
  }
  if (e instanceof LightSignMessageError) {
    return `Cannot sign personal message`;
  }
  if (e instanceof LightCreationError) {
    return "Cannot create new Lightwallet";
  }
  if (e instanceof LightDeserializeError) {
    return "Problem with Vault retrieval";
  }
  if (e instanceof LightKeyEncryptError) {
    return "Problem with lightWallet encryption";
  }
  if (e instanceof LightWalletWrongPassword) {
    return "Password is not correct";
  }
  if (e instanceof LightWalletWrongMnemonic) {
    return "Recovery phrase entered is not correct";
  }

  return "Light wallet unavailable";
}
