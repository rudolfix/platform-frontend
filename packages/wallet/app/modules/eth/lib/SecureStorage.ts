import { Opaque } from "@neufund/shared-utils";
import { utils } from "ethers";
import AsyncStorage from "@react-native-community/async-storage";
import * as Keychain from "react-native-keychain";

export type TSecureReference = Opaque<"SecureReference", string>;

const toSecureReference = (reference: string) => reference as TSecureReference;

/**
 * An encrypted secure storage
 *
 * @note Current implementation is just an interface. Soon we will replace it by react-native-keychain.
 *       In long term we hide all secure storage under native code
 *       to have a control whether key is stored inside device hardware storage
 *
 * @internal SecureStorage access should be restricted to just when really needed
 *           that's why it should be created manually when needed and never connected
 *           to DI container to prevent harmful access and data leakage
 */
class SecureStorage {
  /**
   * Saves the secret in secure storage and returns a reference to the secret
   *
   * @param secret - A secret to secure
   */
  async setSecret(secret: string): Promise<TSecureReference> {
    const reference = utils.bigNumberify(utils.randomBytes(32)).toString();
    await Keychain.setGenericPassword("", secret, {
      service: reference,
      accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
      accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE, // we might need to downgrade this to SOFTWARE, for it to work on all android phones
    });
    return toSecureReference(reference);
  }

  /**
   * For a give reference returns the secret from the secret storage
   *
   * @param secretReference - A reference to the secret
   */
  async getSecret(secretReference: TSecureReference): Promise<string | null> {
    const result = await Keychain.getGenericPassword({ 
      service: secretReference,
      authenticationPrompt: {
        "title": "Access Key",
        "subtitle": "Allow Neufund to access your ethereum key.",
        "description": "",
        "cancel": "Deny"
      }});
    if (result) {
      return result.password;
    }
    return null;
  }

  /**
   * For a give reference deletes the secret from the secret storage
   *
   * @param secretReference - A reference to the secret
   */
  async deleteSecret(secretReference: TSecureReference): Promise<void> {
    await Keychain.resetGenericPassword({ service: secretReference });
  }
}

export { SecureStorage, toSecureReference };
