import React from "react";
import { StyleSheet, View } from "react-native";

import { baseSilver } from "styles/colors";

import { IconSpacer } from "./IconSpacer";

const ItemSeparatorComponent: React.FunctionComponent = () => {
  return (
    <View style={styles.separator}>
      <IconSpacer />
      <View style={styles.separatorLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    height: 1,
    flexDirection: "row",
  },
  separatorLine: {
    backgroundColor: baseSilver,
    flex: 1,
  },
});

export { ItemSeparatorComponent };
