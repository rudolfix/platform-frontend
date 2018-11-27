import {
  LightCreationError,
  LightDeserializeError,
  LightKeyEncryptError,
  LightSignMessageError,
  LightWalletWrongMnemonic,
  LightWalletWrongPassword,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import {LightWalletErrorMessage} from '../../../components/translatedMessages/errorMessages'

export function mapLightWalletErrorToErrorMessage(e: Error): LightWalletErrorMessage {
  if (e instanceof LightWrongPasswordSaltError) {
    return LightWalletErrorMessage.WRONG_PASSWORD_SALT;
  }
  if (e instanceof LightSignMessageError) {
    return LightWalletErrorMessage.SIGN_MESSAGE;
  }
  if (e instanceof LightCreationError) {
    return LightWalletErrorMessage.CREATION_ERROR;
  }
  if (e instanceof LightDeserializeError) {
    return LightWalletErrorMessage.DESERIALIZE;
  }
  if (e instanceof LightKeyEncryptError) {
    return LightWalletErrorMessage.ENCRYPTION_ERROR;
  }
  if (e instanceof LightWalletWrongPassword) {
    return LightWalletErrorMessage.WRONG_PASSWORD;
  }
  if (e instanceof LightWalletWrongMnemonic) {
    return LightWalletErrorMessage.WRONG_MNEMONIC;
  }

  return LightWalletErrorMessage.GENERIC_ERROR;
}

