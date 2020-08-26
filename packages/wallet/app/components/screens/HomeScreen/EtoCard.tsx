import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";

import { ETOInvestorState } from "components/shared/eto/ETOInvestorState";
import { Panel } from "components/shared/panel/Panel";
import { Headline } from "components/shared/typography/Headline";

import { baseGray, baseWhite } from "styles/colors";
import { roundness, shadowStyles } from "styles/common";
import { spacing2, spacingStyles } from "styles/spacings";
import { typographyStyles } from "styles/typography";

type TEtoCardProps = {
  eto: TEtoWithCompanyAndContract;
  onPress: () => void;
};

const EtoCard: React.FunctionComponent<TEtoCardProps & React.ComponentProps<typeof Panel>> = ({
  eto,
  onPress,
  style,
  ...props
}) => (
  <TouchableHighlight underlayColor="transparent" onPress={onPress} {...props}>
    <View style={[styles.wrapper, style]}>
      <View style={styles.companyThumbnailWrapper}>
        <Image
          source={{ uri: eto.company.companyPreviewCardBanner }}
          style={styles.companyThumbnail}
          accessibilityIgnoresInvertColors
        />

        {eto.company.categories && (
          <View style={styles.categories}>
            {eto.company.categories.map(category => (
              <Text key={category} style={styles.category}>
                {category}
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.body}>
        <ETOInvestorState eto={eto} style={styles.stateRow} />

        <View>
          <Headline level={3}>{eto.company.brandName}</Headline>
        </View>
      </View>
    </View>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  wrapper: {
    ...shadowStyles.s2,
    borderRadius: roundness,
    backgroundColor: baseWhite,
  },
  companyThumbnail: {
    width: "100%",
    borderRadius: roundness,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 237,
  },
  categories: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    bottom: spacing2,
    left: "20%",
    right: spacing2,
  },
  category: {
    ...typographyStyles.helperText,
    ...spacingStyles.ph2,
    ...spacingStyles.ml2,
    ...spacingStyles.mt2,
    paddingVertical: 2,
    backgroundColor: baseGray,
    borderRadius: 10,
    color: baseWhite,
    overflow: "hidden",
  },
  stateRow: {
    ...spacingStyles.mb2,
  },
  body: {
    ...spacingStyles.p4,
  },
  companyThumbnailWrapper: {
    position: "relative",
  },
});

export { EtoCard };
