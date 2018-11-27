import {
  LightCreationError,
  LightDeserializeError,
  LightKeyEncryptError,
  LightSignMessageError,
  LightWalletWrongMnemonic,
  LightWalletWrongPassword,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import {IMessage, LightWalletErrorMessage} from '../../../components/translatedMessages/messages'

export function mapLightWalletErrorToErrorMessage(e: Error): IMessage {
  if (e instanceof LightWrongPasswordSaltError) {
    return {messageType: LightWalletErrorMessage.WRONG_PASSWORD_SALT};
  }
  if (e instanceof LightSignMessageError) {
    return {messageType: LightWalletErrorMessage.SIGN_MESSAGE};
  }
  if (e instanceof LightCreationError) {
    return {messageType: LightWalletErrorMessage.CREATION_ERROR};
  }
  if (e instanceof LightDeserializeError) {
    return {messageType: LightWalletErrorMessage.DESERIALIZE};
  }
  if (e instanceof LightKeyEncryptError) {
    return {messageType: LightWalletErrorMessage.ENCRYPTION_ERROR};
  }
  if (e instanceof LightWalletWrongPassword) {
    return {messageType: LightWalletErrorMessage.WRONG_PASSWORD};
  }
  if (e instanceof LightWalletWrongMnemonic) {
    return {messageType: LightWalletErrorMessage.WRONG_MNEMONIC};
  }

  return {messageType: LightWalletErrorMessage.GENERIC_ERROR};
}

