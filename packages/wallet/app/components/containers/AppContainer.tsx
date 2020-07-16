import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import React from "react";
import { IntlProvider } from "react-intl";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { Store } from "redux";

import { ThemeProvider } from "themes/ThemeProvider";

// eslint-disable-next-line import/no-relative-parent-imports
import languageEn from "../../locales/en-en.json";

type TExternalProps = {
  store: Store;
};

const AppContainer: React.FunctionComponent<TExternalProps> = ({ children, store }) => (
  <ReduxProvider store={store}>
    <ThemeProvider>
      <IntlProvider locale="en-gb" messages={languageEn}>
        <ActionSheetProvider>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </ActionSheetProvider>
      </IntlProvider>
    </ThemeProvider>
  </ReduxProvider>
);

export { AppContainer };
