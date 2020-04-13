import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  baseGray,
  baseSilver,
  baseWhite,
  blueyGray,
  grayLighter4,
} from "../../../../../styles/colors";
import { spacingStyles } from "../../../../../styles/spacings";
import { typographyStyles } from "../../../../../styles/typography";
import { st } from "../../../../utils";
import { EIconType, Icon } from "../../../Icon";
import { BodyText } from "../../../typography/BodyText";

type TTouchableProps = React.ComponentProps<typeof TouchableOpacity>;

type TItemExternalProps = {
  id: string;
  title: string;
  subTitle?: string;
  isSelected: boolean;
} & Omit<TTouchableProps, "activeColor" | "children">;

const SelectListItem: React.FunctionComponent<TItemExternalProps> = ({
  id,
  title,
  subTitle,
  isSelected,
  ...props
}) => (
  <TouchableOpacity
    style={st(styles.container)}
    activeOpacity={0.4}
    accessibilityRole="combobox"
    accessibilityComponentType={isSelected ? "radiobutton_checked" : "radiobutton_unchecked"}
    accessibilityTraits={isSelected ? ["button", "selected"] : "button"}
    accessibilityStates={isSelected ? ["selected"] : []}
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
        <Text style={styles.subTitle} numberOfLines={1}>
          {subTitle}
        </Text>
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
    ...typographyStyles.menuLabel,
    color: blueyGray,
  },
});

export { SelectListItem };
