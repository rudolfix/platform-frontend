import React from "react";
import { StyleSheet } from "react-native";

import { Header } from "components/screens/HomeScreen/Header";
import { EStatusBarStyle, SafeAreaScreen } from "components/shared/Screen";

import { spacingStyles } from "styles/spacings";

const HomeScreenLayoutContainer: React.FunctionComponent = ({ children }) => (
  <>
    <Header />
    <SafeAreaScreen style={styles.container} statusBarStyle={EStatusBarStyle.WHITE}>
      {children}
    </SafeAreaScreen>
  </>
);

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.pv5,
  },
});

export { HomeScreenLayoutContainer };
