import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Container } from "inversify";
import React from "react";
import { IntlProvider } from "react-intl";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { Store } from "redux";

import { ThemeProvider } from "themes/ThemeProvider";

// eslint-disable-next-line import/no-relative-parent-imports
import languageEn from "../../locales/en-en.json";
import { InversifyProvider } from "./InversifyProvider";

type TExternalProps = {
  store: Store;
  container: Container;
};

const AppContainer: React.FunctionComponent<TExternalProps> = ({ children, store, container }) => (
  <ReduxProvider store={store}>
    <ThemeProvider>
      <InversifyProvider container={container}>
        <IntlProvider locale="en-gb" messages={languageEn}>
          <ActionSheetProvider>
            <SafeAreaProvider>{children}</SafeAreaProvider>
          </ActionSheetProvider>
        </IntlProvider>
      </InversifyProvider>
    </ThemeProvider>
  </ReduxProvider>
);

export { AppContainer };
