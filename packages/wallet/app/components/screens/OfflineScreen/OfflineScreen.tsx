import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { NeuGradientScreen } from "components/shared/NeuGradientScreen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";


import { baseGray, baseSilver, baseWhite } from "styles/colors";
import { spacingStyles } from "styles/spacings";
import { typographyStyles } from "styles/typography";

const OfflineScreen: React.FunctionComponent = () => (
  <NeuGradientScreen style={styles.wrapper}>
    <View style={styles.iconContainer}>
      <Icon type={EIconType.OFFLINE_MODE} style={styles.icon} />
    </View>

    <View style={styles.container}>
      <Headline level={EHeadlineLevel.LEVEL2} style={styles.headline}>
        Looks like you're offline
      </Headline>
      <Text style={styles.caption}>Please check your network connection and try again.</Text>

      <Button style={styles.tryAgainButton} layout={EButtonLayout.PRIMARY} onPress={f => f}>
        Try Again
      </Button>
    </View>
  </NeuGradientScreen>
);

const styles = StyleSheet.create({
  wrapper: {
    ...spacingStyles.p4,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  container: {
    justifyContent: "center",
  },
  icon: {
    color: baseGray,
    width: "100%",
  },
  headline: {
    ...spacingStyles.mt4,
    textAlign: "center",
    color: baseWhite,
  },
  caption: {
    ...spacingStyles.mt4,
    ...spacingStyles.mb6,
    ...typographyStyles.body,
    textAlign: "center",
    color: baseSilver,
  },
  tryAgainButton: {
    ...spacingStyles.mb2,
  },
});

export { OfflineScreen };
