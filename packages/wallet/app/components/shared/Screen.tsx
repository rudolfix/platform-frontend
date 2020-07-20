import { useHeaderHeight } from "@react-navigation/stack";
import * as React from "react";
import { Animated, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useSafeArea } from "react-native-safe-area-context";
import SafeAreaView from "react-native-safe-area-view";

import { baseWhite } from "styles/colors";

import { isIOS } from "utils/Platform";

import { EStatusBarStyle, useStatusBarStyle } from "./hooks/useStatusBarStyle";

type TExternalCommonProps = {
  statusBarStyle?: EStatusBarStyle;
};

type TSafeAreaScreenExternalProps = {
  /**
   * In some cases (for .e.g tab navigation screen) safe area top inset
   * should be forced manually to avoid paddingTop jumping after onLayout rerender
   */
  forceTopInset?: boolean;
} & TExternalCommonProps &
  React.ComponentProps<typeof Animated.ScrollView>;

/**
 * A core screen component stacking together safe area, keyboard avoiding and scroll views
 */
const SafeAreaScreen: React.FunctionComponent<TSafeAreaScreenExternalProps> = ({
  children,
  statusBarStyle = EStatusBarStyle.INHERIT,
  forceTopInset,
  bounces,
  overScrollMode,
  ...props
}) => {
  useStatusBarStyle(statusBarStyle);

  const headerHeight = useHeaderHeight();
  const insets = useSafeArea();

  const scrollMode = overScrollMode ?? (bounces ? "never" : undefined);

  return (
    <SafeAreaView style={styles.screen} forceInset={forceTopInset ? { top: "always" } : undefined}>
      <KeyboardAvoidingView
        behavior={isIOS ? "padding" : undefined}
        keyboardVerticalOffset={headerHeight + insets.top}
        style={styles.container}
      >
        <Animated.ScrollView
          keyboardShouldPersistTaps="handled"
          bounces={bounces}
          overScrollMode={scrollMode}
          {...props}
        >
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type TScreenExternalProps = TExternalCommonProps & React.ComponentProps<typeof Animated.ScrollView>;

/**
 * A core screen component stacking together keyboard avoiding and scroll views
 */
const Screen: React.FunctionComponent<TScreenExternalProps> = ({
  children,
  statusBarStyle = EStatusBarStyle.INHERIT,
  contentContainerStyle,
  bounces,
  overScrollMode,
  ...props
}) => {
  useStatusBarStyle(statusBarStyle);

  const headerHeight = useHeaderHeight();
  const insets = useSafeArea();

  const scrollMode = overScrollMode ?? (bounces ? "never" : undefined);

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? "position" : undefined}
      contentContainerStyle={styles.container}
      keyboardVerticalOffset={headerHeight + insets.top}
      style={styles.screen}
    >
      <Animated.ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, contentContainerStyle]}
        bounces={bounces}
        overScrollMode={scrollMode}
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
  container: {
    flexGrow: 1,
  },
});

export { SafeAreaScreen, Screen, EStatusBarStyle };
