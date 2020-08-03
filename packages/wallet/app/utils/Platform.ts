import { invariant, Overwrite } from "@neufund/shared-utils";
// eslint-disable-next-line react-native/split-platform-components,no-restricted-imports
import { Platform as NativePlatform, PlatformAndroidStatic, PlatformIOSStatic } from "react-native";

export const ANDROID_VERSION_LOLLIPOP = 21;

invariant(
  NativePlatform.OS === "android" || NativePlatform.OS === "ios",
  `Unsupported platform ${NativePlatform.OS}`,
);

/**
 * An enum with supported platforms.
 * Useful in conditions to enforce typechecking.
 */
enum EPlatform {
  IOS = "ios",
  Android = "android",
}

// Will typecast platforms to only include supported ones
const Platform = NativePlatform as
  | Overwrite<PlatformIOSStatic, { OS: EPlatform.IOS }>
  | Overwrite<PlatformAndroidStatic, { OS: EPlatform.Android }>;

const isIOS = Platform.OS === EPlatform.IOS;
const isAndroid = Platform.OS === EPlatform.Android;

const isAndroidLollipopOrHigher = isAndroid && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

export { Platform, EPlatform, isIOS, isAndroid, isAndroidLollipopOrHigher };
