import {
  LightCreationError,
  LightDeserializeError,
  LightKeyEncryptError,
  LightSignMessageError,
  LightWalletWrongMnemonic,
  LightWalletWrongPassword,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import {LightWalletErrorMessage} from "../../../config/errorMessages";

export function mapLightWalletErrorToErrorMessage(e: Error): LightWalletErrorMessage {
  if (e instanceof LightWrongPasswordSaltError) {
    return LightWalletErrorMessage.LIGHT_WALLET_WRONG_PASSWORD_SALT;
  }
  if (e instanceof LightSignMessageError) {
    return LightWalletErrorMessage.LIGHT_WALLET_SIGN_MESSAGE;
  }
  if (e instanceof LightCreationError) {
    return LightWalletErrorMessage.LIGHT_WALLET_CREATION_ERROR;
  }
  if (e instanceof LightDeserializeError) {
    return LightWalletErrorMessage.LIGHT_WALLET_DESERIALIZE;
  }
  if (e instanceof LightKeyEncryptError) {
    return LightWalletErrorMessage.LIGHT_WALLET_ENCRYPTION_ERROR;
  }
  if (e instanceof LightWalletWrongPassword) {
    return LightWalletErrorMessage.LIGHT_WALLET_WRONG_PASSWORD;
  }
  if (e instanceof LightWalletWrongMnemonic) {
    return LightWalletErrorMessage.LIGHT_WALLET_WRONG_MNEMONIC;
  }

  return LightWalletErrorMessage.LIGHT_WALLET_GENERIC_ERROR;
}
