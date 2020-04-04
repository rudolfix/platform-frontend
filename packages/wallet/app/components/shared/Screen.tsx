import { useHeaderHeight } from "@react-navigation/stack";
import * as React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import { silverLighter2 } from "../../styles/colors";

type TExternalProps = React.ComponentProps<typeof ScrollView>;

/**
 * A core screen component stacking together safe area, keyboard avoiding and scroll views
 */
const Screen: React.FunctionComponent<TExternalProps> = ({ children, style, ...props }) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeArea();

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "position" : undefined}
        contentContainerStyle={styles.flex}
        keyboardVerticalOffset={headerHeight + insets.top}
        style={styles.flex}
      >
        <ScrollView style={[styles.flex, style]} keyboardShouldPersistTaps="handled" {...props}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: silverLighter2,
  },
  flex: {
    flex: 1,
  },
});

export { Screen };
