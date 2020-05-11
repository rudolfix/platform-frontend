import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { baseGray, baseGreen, baseWhite } from "../../styles/colors";
import { roundness } from "../../styles/common";
import { spacing2, spacingStyles } from "../../styles/spacings";
import { typographyStyles } from "../../styles/typography";
import { HelperText } from "../shared/forms/layouts/HelperText";
import { Panel } from "../shared/panel/Panel";
import { BodyBoldText } from "../shared/typography/BodyText";

const EtoCard = ({ categories, companyThumbnail, companyName, etoState, ...props }) => (
  <Panel {...props} contentContainerStyle={[styles.panel, props.style]}>
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
      <View style={styles.statusRow}>
        <View style={styles.statusIndicator} />
        <HelperText style={styles.stateName}>{etoState}</HelperText>
      </View>

      <View>
        <BodyBoldText style={styles.companyName}>{companyName}</BodyBoldText>
      </View>
    </View>
  </Panel>
);

const styles = StyleSheet.create({
  panel: {
    padding: 0,
  },
  panelContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  body: {
    ...spacingStyles.p4,
  },
  statusRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  stateName: {
    marginLeft: 6,
    textTransform: "uppercase",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    backgroundColor: baseGreen,
    borderRadius: 50,
  },
  companyThumbnailWrapper: {
    position: "relative",
  },
  companyThumbnail: {
    width: "100%",
    borderRadius: roundness,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  categories: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    bottom: spacing2,
    left: 0,
    right: spacing2,
    backgroundColor: 'red'
  },
  category: {
    ...typographyStyles.helperText,
    backgroundColor: baseGray,
    borderRadius: 10,
    color: baseWhite,
    ...spacingStyles.p2,
    ...spacingStyles.mr2,
  },
  companyName: {
    ...typographyStyles.headline3,
  },
});

export { EtoCard };
