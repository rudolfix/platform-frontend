import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import SafeAreaView from "react-native-safe-area-view";

import { EStatusBarStyle, useStatusBarStyle } from "components/shared/hooks/useStatusBarStyle";

import { baseWhite, silverLighter2 } from "styles/colors";
import { spacing1, spacing4, spacing8 } from "styles/spacings";

import { NeuLinearGradient } from "./NeuLinearGradient";
import { BodyText } from "./typography/BodyText";
import { EHeadlineLevel, Headline } from "./typography/Headline";

// To not cut scroll elements before we align with the container
// additional padding is applied
const EXTRA_PADDING_FOR_OVERFLOW = 100;

const SCROLL_MARGIN_ANIMATION_MAX_RANGE = 100;
const SCROLL_FONT_ANIMATION_MAX_RANGE = 250;
const HEADING_FONT_SIZE_MAX_SCALE = 0.5;
const HEADING_BODY_FONT_SIZE_MAX_SCALE = 0.75;

type TExternalProps = {
  blurHeadings?: boolean;
  heading: React.ReactNode;
  subHeading: React.ReactNode;
  children: (props: React.ComponentProps<typeof Animated.ScrollView>) => React.ReactNode;
};

const HeaderScreen: React.FunctionComponent<TExternalProps> = ({
  heading,
  subHeading,
  children,
}) => {
  const valueRef = React.useRef(new Animated.Value(0));

  const headerMargin = valueRef.current.interpolate({
    inputRange: [0, SCROLL_MARGIN_ANIMATION_MAX_RANGE],
    outputRange: [spacing8, spacing1],
    extrapolate: "clamp",
  });

  const headlineTextSizeFactor = valueRef.current.interpolate({
    inputRange: [SCROLL_MARGIN_ANIMATION_MAX_RANGE, SCROLL_FONT_ANIMATION_MAX_RANGE],
    outputRange: [1, HEADING_FONT_SIZE_MAX_SCALE],
    extrapolate: "clamp",
  });

  const bodyTextSizeFactory = valueRef.current.interpolate({
    inputRange: [SCROLL_MARGIN_ANIMATION_MAX_RANGE, SCROLL_FONT_ANIMATION_MAX_RANGE],
    outputRange: [1, HEADING_BODY_FONT_SIZE_MAX_SCALE],
    extrapolate: "clamp",
  });

  const containerMargin = valueRef.current.interpolate({
    inputRange: [0, SCROLL_MARGIN_ANIMATION_MAX_RANGE],
    outputRange: [-EXTRA_PADDING_FOR_OVERFLOW - spacing4, 0],
    extrapolate: "clamp",
  });

  const screenProps = {
    bounces: false,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
    onScroll: Animated.event(
      [
        {
          nativeEvent: { contentOffset: { y: valueRef.current } },
        },
      ],
      { useNativeDriver: false },
    ),
    style: {
      marginTop: containerMargin,
    },
    contentContainerStyle: {
      paddingTop: EXTRA_PADDING_FOR_OVERFLOW,
    },
  };

  useStatusBarStyle(EStatusBarStyle.DARK_BLUEY_GRAY);

  return (
    <View style={styles.container}>
      <NeuLinearGradient angle={260}>
        <SafeAreaView forceInset={{ top: "always", bottom: "never" }}>
          <Animated.View
            style={[styles.header, { marginTop: headerMargin, marginBottom: headerMargin }]}
          >
            <Headline
              style={styles.headerHeading}
              level={EHeadlineLevel.LEVEL1}
              sizeFactor={headlineTextSizeFactor}
            >
              {heading}
            </Headline>
            <BodyText style={styles.headerSubHeading} sizeFactor={bodyTextSizeFactory}>
              {subHeading}
            </BodyText>
          </Animated.View>
        </SafeAreaView>
      </NeuLinearGradient>

      {/* top inset is already applied by header */}
      <SafeAreaView style={styles.container} forceInset={{ top: "never" }}>
        {children(screenProps)}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerHeading: {
    color: baseWhite,
  },
  headerSubHeading: {
    color: silverLighter2,
    opacity: 0.5,
  },
});

export { HeaderScreen };
