import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { BodyText } from "components/shared/typography/BodyText";
import { MenuLabel } from "components/shared/typography/MenuLabel";
import { st } from "components/utils";

import { baseGray, baseSilver, baseWhite, blueyGray, grayLighter4 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TTouchableProps = React.ComponentProps<typeof TouchableOpacity>;

enum ESwitcherItemPosition {
  FIRST = "first",
  LAST = "last",
  UNKNOWN = "UNKNOWN",
}

type TItemExternalProps = {
  id: string;
  title: string;
  subTitle?: string;
  isSelected: boolean;
  position: ESwitcherItemPosition;
} & Omit<TTouchableProps, "activeColor" | "children">;

const SwitcherItem: React.FunctionComponent<TItemExternalProps> = ({
  id,
  title,
  subTitle,
  isSelected,
  position,
  ...props
}) => (
  <TouchableOpacity
    style={st(styles.container, [position === ESwitcherItemPosition.LAST, styles.containerLast])}
    activeOpacity={0.4}
    accessibilityRole="checkbox"
    // double negate accessibilityState
    // https://github.com/FormidableLabs/eslint-plugin-react-native-a11y/issues/84
    accessibilityState={{ checked: !!isSelected }}
    {...props}
  >
    <>
      <Icon
        style={st(styles.icon, [isSelected, styles.iconSelected])}
        type={isSelected ? EIconType.YES : EIconType.PLACEHOLDER}
      />
      <View style={styles.titleWrapper}>
        <BodyText style={styles.title} numberOfLines={1}>
          {title}
        </BodyText>
        <MenuLabel style={styles.subTitle} numberOfLines={1}>
          {subTitle}
        </MenuLabel>
      </View>
    </>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.p4,

    backgroundColor: baseWhite,
    borderBottomColor: baseSilver,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  containerLast: {
    borderBottomWidth: 0,
  },
  icon: {
    ...spacingStyles.mr3,

    color: grayLighter4,
    width: 24,
    height: 24,
  },
  iconSelected: {
    color: baseGray,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    color: baseGray,
  },
  subTitle: {
    color: blueyGray,
  },
});

export { SwitcherItem, ESwitcherItemPosition };
