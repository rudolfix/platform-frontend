import { nonNullable } from "@neufund/shared-utils";
import { NativeModules } from "react-native";

/**
 * Custom native module that makes sure screen information is protected.
 *
 * - on background transition sensitive information is removed from the screen
 * - screenshot/video recording is blocked (only Android)
 *
 * @note To ensure memory that hold sensitive information is release you also need to unmount component.
 *       To do that use `withProtectSensitive` HOC.
 *
 * @example
 *
 * import React from "react";
 * import { Text } from "react-native";
 *
 * import { enable, disable } from "./RNProtect";
 *
 * const SensitiveComponentContainer = () => {
 *   React.useEffect(() => {
 *     enable();
 *
 *     return () => disable()
 *   })
 *
 *   return <SensitiveComponentLayout />
 * }
 */

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const RNProtectScreen: { enable: () => void; disable: () => void } = nonNullable(
  NativeModules.RNProtectScreen,
  "RNProtectScreen native module is not available. Make sure it's setup properly for the target platform",
);

export { RNProtectScreen };
