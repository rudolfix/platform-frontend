import * as React from "react";
import { FormattedMessage } from "react-intl";
import { StyleSheet } from "react-native";

import { SafeAreaScreen } from "components/shared/Screen";
import { Text } from "components/shared/typography/Text";

import { darkBlueGray2 } from "styles/colors";

const ErrorBoundaryScreen: React.FunctionComponent = () => (
  <SafeAreaScreen contentContainerStyle={styles.container}>
    <Text>
      <FormattedMessage id="error-boundary.main-error-message" />
    </Text>
  </SafeAreaScreen>
);

const styles = StyleSheet.create({
  container: {
    color: darkBlueGray2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export { ErrorBoundaryScreen };
