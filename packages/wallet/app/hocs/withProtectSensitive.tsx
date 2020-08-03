import { useAppState } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import React from "react";

import { withContainer } from "hocs/withContainer";

import { RNProtectScreen } from "native-modules/RNProtectScreen";

type TExternalProps = { children: React.ReactElement };

/**
 * Protects sensitive `children` by unmounting as soon as information is not needed to be shown.
 */
const ProtectSensitive: React.FunctionComponent<TExternalProps> = ({ children }) => {
  const isFocused = useIsFocused();
  const appState = useAppState();

  // children is safe to render when it's fully visible
  // and that means
  // - screen is focused
  // - app is active (not in the background)
  const isSafeToRender = appState !== "background" && isFocused;

  React.useEffect(() => {
    RNProtectScreen.enable();

    return RNProtectScreen.disable;
  }, []);

  return isSafeToRender ? children : null;
};

const withProtectSensitive = withContainer(ProtectSensitive);

export { withProtectSensitive };
