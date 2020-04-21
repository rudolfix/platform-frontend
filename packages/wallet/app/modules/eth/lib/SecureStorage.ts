import { Opaque } from "@neufund/shared-utils";
import { utils } from "ethers";
import { Cache, CacheClass } from "memory-cache";
import AsyncStorage from "@react-native-community/async-storage";
import * as Keychain from "react-native-keychain";

export type TSecureReference = Opaque<"SecureReference", string>;

const toSecureReference = (reference: string) => reference as TSecureReference;
const CACHE_TIMEOUT = 10000; // 10 seconds

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
   * Falls back to async storage on emulators in dev builds
   *
   * @param secret - A secret to secure
   */
  private readonly useAsyncStorageFallback: boolean;
  private readonly localCache: CacheClass<string, string>;

  constructor(useAsyncStorageFallback: boolean) {
    this.useAsyncStorageFallback = useAsyncStorageFallback && __DEV__; // extra safe dev check :)
    this.localCache = new Cache();
  }

  async setSecret(secret: string): Promise<TSecureReference> {
    const reference = utils.bigNumberify(utils.randomBytes(32)).toString();

    // dev implementation
    if (this.useAsyncStorageFallback) {
      await AsyncStorage.setItem(reference, secret);
    }

    // keychain implementation
    else {
      await Keychain.setInternetCredentials(reference, "", secret, {
        accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
        accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
      });
    }

    // save in cache and return
    this.localCache.put(reference, secret, CACHE_TIMEOUT);
    return toSecureReference(reference);
  }

  /**
   * For a give reference returns the secret from the secret storage
   *
   * @param reference - A reference to the secret
   */
  async getSecret(reference: TSecureReference): Promise<string | null> {
    // check for cached values
    if (this.localCache.get(reference)) {
      return this.localCache.get(reference);
    }

    // dev implementation
    if (this.useAsyncStorageFallback) {
      return AsyncStorage.getItem(reference);
    }

    // keychain implementation
    const result = await Keychain.getInternetCredentials(reference, {
      authenticationPrompt: {
        title: "Access Key",
        subtitle: "Allow Neufund to access your ethereum key.",
        description: "",
        cancel: "Deny",
      },
    });

    // return
    if (result) {
      this.localCache.put(reference, result.password, CACHE_TIMEOUT);
      return result.password;
    }

    return null;
  }

  /**
   * For a give reference checks wether a secret exists
   *
   * @param reference - A reference to the secret
   */
  async hasSecret(reference: TSecureReference): Promise<boolean> {
    if (this.localCache.get(reference)) {
      return true;
    }
    if (this.useAsyncStorageFallback) {
      return !!AsyncStorage.getItem(reference);
    }
    return !!(await Keychain.hasInternetCredentials(reference));
  }

  /**
   * For a give reference deletes the secret from the secret storage
   *
   * @param reference - A reference to the secret
   */
  async deleteSecret(reference: TSecureReference): Promise<void> {
    this.localCache.del(reference);
    if (this.useAsyncStorageFallback) {
      await AsyncStorage.removeItem(reference);
    } else {
      await Keychain.resetInternetCredentials(reference);
    }
  }
}

export { SecureStorage, toSecureReference };
