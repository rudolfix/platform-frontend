import { StyleSheet } from "react-native";

import { baseGray, baseGreen, blueyGray } from "styles/colors";
import { spacingStyles } from "styles/spacings";

const transactionSharedStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
  },
  spacer: { alignSelf: "center" },
  icon: {
    color: baseGray,
    width: "100%",
    height: "100%",
  },
  wrapper: {
    ...spacingStyles.pr4,

    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameWrapper: {
    flexShrink: 1,
  },
  name: {
    color: baseGray,
  },
  date: {
    color: blueyGray,
  },
  valueWrapper: {
    alignItems: "flex-end",
  },
  valueIn: {
    color: baseGreen,
  },
  valueOut: {
    color: baseGray,
  },
  valueEquivalent: {
    color: blueyGray,
  },
});

export { transactionSharedStyles };
