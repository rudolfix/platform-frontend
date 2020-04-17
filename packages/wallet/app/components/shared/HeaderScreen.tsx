import React from "react";
import { Animated, SafeAreaView, StyleSheet, View } from "react-native";

import { baseWhite, silverLighter2 } from "../../styles/colors";
import { spacing4, spacing8 } from "../../styles/spacings";
import { NeuLinearGradient } from "./NeuLinearGradient";
import { Screen } from "./Screen";
import { BodyText } from "./typography/BodyText";
import { EHeadlineLevel, Headline } from "./typography/Headline";

// To not cut scroll elements before we align with the container we need to have additional padding
const EXTRA_PADDING_FOR_OVERFLOW = 100;

type TExternalProps = {
  heading: string;
  subHeading: string;
} & React.ComponentProps<typeof Screen>;

const HeaderScreen: React.FunctionComponent<TExternalProps> = ({
  heading,
  subHeading,
  children,
  contentContainerStyle,
  style,
}) => {
  const valueRef = React.useRef(new Animated.Value(0));

  const headerMargin = valueRef.current.interpolate({
    inputRange: [0, 100],
    outputRange: [spacing8, 5],
    extrapolate: "clamp",
  });

  const headlineTextSizeFactor = valueRef.current.interpolate({
    inputRange: [100, 250],
    outputRange: [1, 0.5],
    extrapolate: "clamp",
  });

  const bodyTextSizeFactory = valueRef.current.interpolate({
    inputRange: [100, 250],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });

  const containerMargin = valueRef.current.interpolate({
    inputRange: [0, 100],
    outputRange: [-EXTRA_PADDING_FOR_OVERFLOW - spacing4, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <NeuLinearGradient angle={260}>
        <SafeAreaView>
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

      <Screen
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { y: valueRef.current } },
          },
        ])}
        style={[
          style,
          {
            marginTop: containerMargin,
          },
        ]}
        contentContainerStyle={[
          contentContainerStyle,
          {
            paddingTop: EXTRA_PADDING_FOR_OVERFLOW,
          },
        ]}
      >
        {children}
      </Screen>
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
