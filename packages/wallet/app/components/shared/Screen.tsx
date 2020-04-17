import { useHeaderHeight } from "@react-navigation/stack";
import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Animated,
  StyleSheet,
} from "react-native";
import { useSafeArea } from "react-native-safe-area-context";

import { baseWhite } from "../../styles/colors";

/**
 * A core screen component stacking together safe area, keyboard avoiding and scroll views
 */
const SafeAreaScreen: React.FunctionComponent<React.ComponentProps<typeof ScrollView>> = ({
  children,
  style,
  ...props
}) => {
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

/**
 * A core screen component stacking together keyboard avoiding and scroll views
 */
const Screen: React.FunctionComponent<React.ComponentProps<typeof Animated.ScrollView>> = ({
  children,
  style,
  ...props
}) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeArea();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "position" : undefined}
      contentContainerStyle={styles.flex}
      keyboardVerticalOffset={headerHeight + insets.top}
      style={styles.screen}
    >
      <Animated.ScrollView
        style={[styles.flex, style]}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: baseWhite,
  },
  flex: {
    flex: 1,
  },
});

export { SafeAreaScreen, Screen };
