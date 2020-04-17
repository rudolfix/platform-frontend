import { toEquityTokenSymbol } from "@neufund/shared";
import React from "react";
import { Animated, SafeAreaView, StyleSheet, View } from "react-native";
import { baseWhite, silverLighter2 } from "../styles/colors";
import { spacing4, spacing8, spacingStyles } from "../styles/spacings";

import { Asset, EAssetType } from "./shared/asset/Asset";
import { NeuLinearGradient } from "./shared/NeuLinearGradient";
import { BodyText } from "./shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "./shared/typography/Headline";

// To not cut scroll elements before we align with the container we need to have additional padding
const EXTRA_PADDING_FOR_OVERFLOW = 100;

const Portfolio: React.FunctionComponent = () => {
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
    <View style={{ flex: 1 }}>
      <NeuLinearGradient style={styles.headerContainer} angle={260}>
        <SafeAreaView>
          <Animated.View
            style={[styles.header, { marginTop: headerMargin, marginBottom: headerMargin }]}
          >
            <Headline
              style={styles.headerHeading}
              level={EHeadlineLevel.LEVEL1}
              sizeFactor={headlineTextSizeFactor}
            >
              €6 500.00
            </Headline>
            <BodyText style={styles.headerBody} sizeFactor={bodyTextSizeFactory}>
              Portfolio balance
            </BodyText>
          </Animated.View>
        </SafeAreaView>
      </NeuLinearGradient>

      <Animated.ScrollView
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([
          {
            nativeEvent: { contentOffset: { y: valueRef.current } },
          },
        ])}
        style={{
          marginTop: containerMargin,
        }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: EXTRA_PADDING_FOR_OVERFLOW,
          },
        ]}
      >
        <Asset
          tokenImage="https://documents.neufund.io/0x74180B56DD74BC56a2E9D5720F39247c55F23328/e36ee175-e8c6-4f8a-9175-1e22b0a8be53.png"
          name="Fifth Force"
          token={toEquityTokenSymbol("FFT")}
          balance="1000"
          analogBalance="15 000"
          analogToken={toEquityTokenSymbol("EUR")}
          style={styles.asset}
          type={EAssetType.RESERVED}
        />

        {Array.from({ length: 15 }, (_, i) => i).map(i => (
          <Asset
            key={i}
            tokenImage="https://documents.neufund.io/0x74180B56DD74BC56a2E9D5720F39247c55F23328/e36ee175-e8c6-4f8a-9175-1e22b0a8be53.png"
            name="Greyp"
            token={toEquityTokenSymbol("GRP")}
            balance="100"
            analogBalance="1 000"
            analogToken={toEquityTokenSymbol("EUR")}
            style={styles.asset}
            type={EAssetType.NORMAL}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {},
  header: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerHeading: {
    color: baseWhite,
  },
  headerBody: {
    color: silverLighter2,
    opacity: 0.5,
  },
  container: {
    ...spacingStyles.ph4,
  },
  asset: {
    ...spacingStyles.mb2,
  },
});

export { Portfolio };
