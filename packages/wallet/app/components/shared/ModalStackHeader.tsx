import { StackHeaderProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { silverLighter2 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { getTopPadding } from "../../styles/utils";
import { EHeadlineLevel, Headline } from "./typography/Headline";

const ModalStackHeader: React.FunctionComponent<StackHeaderProps> = ({ scene, insets }) => {
  const { options } = scene.descriptor;

  const statusBarHeight = options.headerStatusBarHeight ?? insets.top;

  const title =
    typeof options.headerTitle !== "function" && options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const container = styles.container;

  return (
    <View style={{ ...container, paddingTop: getTopPadding(container) + statusBarHeight }}>
      <Headline
        style={styles.header}
        level={EHeadlineLevel.LEVEL3}
        accessibilityRole="header"
        numberOfLines={1}
      >
        {title}
      </Headline>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.p3,
    backgroundColor: silverLighter2,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  header: {
    flex: 0,
  },
});

export { ModalStackHeader };
