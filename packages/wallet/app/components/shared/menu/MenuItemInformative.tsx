import React from "react";
import { StyleSheet, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { BodyText } from "components/shared/typography/BodyText";
import { Text } from "components/shared/typography/Text";
import { st } from "components/utils";

import { baseGray, baseSilver, blueyGray, grayLighter1 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TMenuItem = {
  id: string;
  icon: EIconType;
  heading: string;
  helperText?: string;
};

const MenuItemInformative: React.FunctionComponent<TMenuItem> = ({ heading, helperText, icon }) => (
  <View style={st(styles.container)}>
    <Icon style={st(styles.icon)} type={icon} />

    <View style={st(styles.wrapper)}>
      <BodyText style={styles.heading} numberOfLines={1}>
        {heading}
      </BodyText>

      {helperText && (
        <Text style={styles.helperText} numberOfLines={1}>
          {helperText}
        </Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 65,
  },
  wrapper: {
    borderTopColor: baseSilver,
    borderTopWidth: 1,

    flex: 1,
    justifyContent: "center",
  },
  icon: {
    ...spacingStyles.mh4,

    alignSelf: "center",
    color: baseGray,

    width: 24,
    height: 24,
  },
  heading: {
    color: grayLighter1,
    lineHeight: 20,
  },
  helperText: {
    color: blueyGray,
    lineHeight: 16,
  },
});

export { MenuItemInformative };
