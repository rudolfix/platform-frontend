import React from "react";
import { StyleSheet } from "react-native";

import { MenuLabelBold } from "components/shared/typography/MenuLabel";

import { baseWhite, bluish } from "styles/colors";
import { spacingStyles } from "styles/spacings";

enum EBadgeType {
  PENDING = "pending",
}

type TMenuLabelProps = React.ComponentProps<typeof MenuLabelBold>;
type TExternalProps = {
  type: EBadgeType;
} & TMenuLabelProps;

const Badge: React.FunctionComponent<TExternalProps> = ({ children }) => (
  <MenuLabelBold style={styles.badge}>{children}</MenuLabelBold>
);

const styles = StyleSheet.create({
  badge: {
    ...spacingStyles.ph2,

    overflow: "hidden",
    borderRadius: 8,
    textTransform: "uppercase",
    backgroundColor: bluish,
    color: baseWhite,
  },
});

export { Badge, EBadgeType };
