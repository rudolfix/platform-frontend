import React from "react";
import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { baseGray, baseGreen, baseWhite } from "../../styles/colors";
import { roundness } from "../../styles/common";
import { spacing2, spacingStyles } from "../../styles/spacings";
import { typographyStyles } from "../../styles/typography";
import { HelperText } from "../shared/forms/layouts/HelperText";
import { Panel } from "../shared/panel/Panel";
import { BodyBoldText } from "../shared/typography/BodyText";

const EtoCard = ({ categories, companyThumbnail, companyName, etoState, onPress, ...props }) => (
  <TouchableHighlight onPress={onPress}>
    <Panel
      {...props}
      style={[styles.panel, props.style]}
      contentContainerStyle={styles.panelContentContainer}
      onPress={onPress}
    >
      <View style={styles.companyThumbnailWrapper}>
        <Image source={companyThumbnail} style={styles.companyThumbnail} />

        <View style={styles.categories}>
          {categories.map(category => (
            <Text key={category} style={styles.category}>
              {category}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.stateRow}>
          <View style={styles.stateIndicator} />
          <HelperText style={styles.stateName}>{etoState}</HelperText>
        </View>

        <View>
          <BodyBoldText style={styles.companyName}>{companyName}</BodyBoldText>
        </View>
      </View>
    </Panel>
  </TouchableHighlight>
);

const styles = StyleSheet.create({
  panel: {
    padding: 0,
  },
  panelContentContainer: {
    padding: 0,
  },
  companyThumbnail: {
    width: "100%",
    borderRadius: roundness,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 237,
    overflow: "hidden",
  },
  categories: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    bottom: spacing2,
    left: spacing2,
    right: spacing2,
  },
  category: {
    ...typographyStyles.helperText,
    backgroundColor: baseGray,
    borderRadius: 10,
    color: baseWhite,
    ...spacingStyles.ph2,
    height: 20,
    ...spacingStyles.ml2,
    alignItems: "center",
    lineHeight: 18,
    overflow: "hidden",
  },
  body: {
    ...spacingStyles.p4,
  },
  stateRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...spacingStyles.mb2,
  },
  stateName: {
    marginLeft: 6,
    textTransform: "uppercase",
  },
  stateIndicator: {
    width: 8,
    height: 8,
    backgroundColor: baseGreen,
    borderRadius: 50,
  },
  companyThumbnailWrapper: {
    position: "relative",
  },
  companyName: {
    ...typographyStyles.headline3,
  },
});

export { EtoCard };
