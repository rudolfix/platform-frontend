import { useHeaderHeight } from "@react-navigation/stack";
import * as React from "react";
import { KeyboardAvoidingView, Platform, Animated, StyleSheet, StatusBar } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useSafeArea } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import { baseWhite, darkBlueGray1 } from "../../styles/colors";

enum EStatusBarStyle {
  WHITE = "white",
  DARK_BLUEY_GRAY = "dark_bluey_gray",
}

const useStatusBarStyle = (statusBarStyle: EStatusBarStyle) =>
  useFocusEffect(
    React.useCallback(() => {
      switch (statusBarStyle) {
        case EStatusBarStyle.WHITE:
          StatusBar.setBarStyle("dark-content");
          StatusBar.setBackgroundColor(baseWhite);
          break;
        case EStatusBarStyle.DARK_BLUEY_GRAY:
          StatusBar.setBarStyle("light-content");
          StatusBar.setBackgroundColor(darkBlueGray1);
          break;
      }
    }, [statusBarStyle]),
  );

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
  style,
  statusBarStyle = EStatusBarStyle.WHITE,
  forceTopInset,
  ...props
}) => {
  useStatusBarStyle(statusBarStyle);

  const headerHeight = useHeaderHeight();
  const insets = useSafeArea();

  return (
    <SafeAreaView style={styles.screen} forceInset={forceTopInset ? { top: "always" } : undefined}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "position" : undefined}
        contentContainerStyle={styles.flex}
        keyboardVerticalOffset={headerHeight + insets.top}
        style={styles.flex}
      >
        <Animated.ScrollView
          style={[styles.flex, style]}
          keyboardShouldPersistTaps="handled"
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
  style,
  statusBarStyle = EStatusBarStyle.WHITE,
  contentContainerStyle,
  ...props
}) => {
  useStatusBarStyle(statusBarStyle);

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
        contentContainerStyle={[styles.flex, contentContainerStyle]}
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

export { SafeAreaScreen, Screen, EStatusBarStyle };
