import { getStorybookUI, configure } from "@storybook/react-native";
import React from "react";
import { IntlProvider } from "react-intl";
import { InteractionManager } from "react-native";
import RNBootSplash from "react-native-bootsplash";
import { SafeAreaProvider } from "react-native-safe-area-context";

// eslint-disable-next-line import/no-unassigned-import
import "./rn-addons";
import { loadStories } from "./storyLoader";

// load stories from dynamically generated file
configure(() => {
  loadStories();
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI

const StorybookUIRoot = getStorybookUI({
  // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
  asyncStorage: require("@react-native-community/async-storage").default,
});

const Storybook: React.FunctionComponent = () => {
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    InteractionManager.runAfterInteractions(() => {
      // we do have custom logic when to hide splash screen for the normal flow
      // for storybook we can hide just when we have UI ready
      RNBootSplash.hide();
    });
  }, []);

  return (
    <IntlProvider locale="en-gb">
      <SafeAreaProvider>
        <StorybookUIRoot />
      </SafeAreaProvider>
    </IntlProvider>
  );
};

export { Storybook };
