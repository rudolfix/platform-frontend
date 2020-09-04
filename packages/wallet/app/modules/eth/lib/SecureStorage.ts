import { assertError, assertNever, Opaque } from "@neufund/shared-utils";
import AsyncStorage from "@react-native-community/async-storage";
import { utils } from "ethers";
import {
  ACCESSIBLE,
  hasInternetCredentials,
  setInternetCredentials,
  getInternetCredentials,
  resetInternetCredentials,
  SECURITY_LEVEL,
  AUTHENTICATION_TYPE,
  ACCESS_CONTROL,
} from "react-native-keychain";

import { SecureStorageAccessCancelled, SecureStorageUnknownError } from "modules/eth/lib/errors";

import { EPlatform, Platform } from "utils/Platform";
import { CacheClass, Cache } from "utils/memoryCache";

import { CACHE_TIMEOUT } from "./constants";

export type TSecureReference = Opaque<"SecureReference", string>;

export const toSecureReference = (reference: string) => reference as TSecureReference;

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

export interface ISecureStorage {
  /**
   * Saves the secret in secure storage and returns a reference to the secret
   * Falls back to async storage on emulators in dev builds
   *
   * @param secret - A secret to secure
   */
  setSecret(secret: string): Promise<TSecureReference>;

  /**
   * For a give reference returns the secret from the secret storage
   *
   * @param reference - A reference to the secret
   */
  getSecret(reference: TSecureReference): Promise<string | null>;

  /**
   * For a give reference checks wether a secret exists
   *
   * @param reference - A reference to the secret
   */
  hasSecret(reference: TSecureReference): Promise<boolean>;

  /**
   * For a give reference deletes the secret from the secret storage
   *
   * @param reference - A reference to the secret
   */
  deleteSecret(reference: TSecureReference): Promise<void>;
}

/**
 *
 * Base implementation with caching layer
 *
 */
abstract class BaseSecureStorage implements ISecureStorage {
  private readonly localCache: CacheClass<string, string>;

  protected constructor() {
    this.localCache = new Cache();
  }

  async setSecret(secret: string): Promise<TSecureReference> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const reference = utils.bigNumberify(utils.randomBytes(32)).toString();

    await this.setSecretInternal(reference, secret);

    this.localCache.put(reference, secret, CACHE_TIMEOUT);

    return toSecureReference(reference);
  }

  abstract async setSecretInternal(reference: string, secret: string): Promise<void>;

  async getSecret(reference: TSecureReference): Promise<string | null> {
    // check for cached values
    if (this.localCache.get(reference)) {
      return this.localCache.get(reference);
    }
    const result = await this.getSecretInternal(reference);
    if (result) {
      this.localCache.put(reference, result, CACHE_TIMEOUT);
    }
    return result;
  }
  abstract async getSecretInternal(reference: string): Promise<string | null>;

  async hasSecret(reference: TSecureReference): Promise<boolean> {
    if (this.localCache.get(reference)) {
      return true;
    }
    return this.hasSecretInternal(reference);
  }
  abstract async hasSecretInternal(reference: TSecureReference): Promise<boolean>;

  async deleteSecret(reference: TSecureReference): Promise<void> {
    this.localCache.del(reference);
    await this.deleteSecretInternal(reference);
  }
  abstract async deleteSecretInternal(reference: TSecureReference): Promise<void>;
}

/**
 *
 * Implementation based on async storage, strictly for Emulator / Simulator use
 *
 */
export class AsyncSecureStorage extends BaseSecureStorage {
  constructor() {
    super();
    // guard against using async storge on non dev environments
    if (!__DEV__) {
      throw new Error("Trying to use AsyncSecureStorage in Production environment!");
    }
  }

  async setSecretInternal(reference: string, secret: string): Promise<void> {
    await AsyncStorage.setItem(reference, secret);
  }

  async getSecretInternal(reference: string): Promise<string | null> {
    return AsyncStorage.getItem(reference);
  }

  async hasSecretInternal(reference: TSecureReference): Promise<boolean> {
    return !!(await AsyncStorage.getItem(reference));
  }

  async deleteSecretInternal(reference: TSecureReference): Promise<void> {
    await AsyncStorage.removeItem(reference);
  }
}

/**
 *
 * Implementation based on keychain, for use on devices and production
 *
 */
export class KeychainSecureStorage extends BaseSecureStorage {
  private readonly useBiometry: boolean;

  constructor(useBiometry: boolean) {
    super();
    this.useBiometry = useBiometry;
  }

  async setSecretInternal(reference: string, secret: string): Promise<void> {
    await setInternetCredentials(reference, "NOT_USED", secret, {
      accessControl: this.useBiometry
        ? ACCESS_CONTROL.BIOMETRY_CURRENT_SET
        : ACCESS_CONTROL.DEVICE_PASSCODE,

      // IOS
      accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      authenticationType: AUTHENTICATION_TYPE.BIOMETRICS,

      // ANDROID
      securityLevel: SECURITY_LEVEL.SECURE_HARDWARE,
    });
  }

  async getSecretInternal(reference: string): Promise<string | null> {
    try {
      const result = await getInternetCredentials(reference, {
        authenticationPrompt: {
          title: "Allow Neufund to manage your ethereum key.",
        },
      });

      if (result) {
        return result.password;
      }

      return null;
    } catch (e) {
      assertError(e);

      switch (Platform.OS) {
        case EPlatform.IOS:
          if (
            // happens when you cancel FACE ID check
            e.message === "User canceled the operation." ||
            // happens when you don't allow FACE ID access permissions
            e.message === "The user name or passphrase you entered is not correct."
          ) {
            throw new SecureStorageAccessCancelled();
          }
          break;
        case EPlatform.Android:
          throw new Error("Not yet supported");

        default:
          assertNever(Platform);
      }

      throw new SecureStorageUnknownError(e.message);
    }
  }

  async hasSecretInternal(reference: TSecureReference): Promise<boolean> {
    return !!(await hasInternetCredentials(reference));
  }

  async deleteSecretInternal(reference: TSecureReference): Promise<void> {
    await resetInternetCredentials(reference);
  }
}
