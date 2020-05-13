import { Opaque } from "@neufund/shared-utils";
import AsyncStorage from "@react-native-community/async-storage";
import { utils } from "ethers";

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
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const reference = utils.bigNumberify(utils.randomBytes(32)).toString();

    await AsyncStorage.setItem(reference, secret);

    return toSecureReference(reference);
  }

  /**
   * For a give reference returns the secret from the secret storage
   *
   * @param secretReference - A reference to the secret
   */
  getSecret(secretReference: TSecureReference): Promise<string | null> {
    return AsyncStorage.getItem(secretReference);
  }

  /**
   * For a give reference deletes the secret from the secret storage
   *
   * @param secretReference - A reference to the secret
   */
  async deleteSecret(secretReference: TSecureReference): Promise<void> {
    await AsyncStorage.removeItem(secretReference);
  }
}

export { SecureStorage, toSecureReference };
