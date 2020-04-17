import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Share } from "react-native";

import { baseGray, baseWhite, grayLighter1 } from "../../styles/colors";
import { roundness, shadowStyles } from "../../styles/common";
import { spacingStyles } from "../../styles/spacings";
import { HelperText } from "../shared/forms/layouts/HelperText";
import { EIconType, Icon } from "../shared/Icon";
import { BodyText } from "../shared/typography/BodyText";

type TViewProps = React.ComponentProps<typeof View>;

type TExternalProps = { address: EthereumAddressWithChecksum } & TViewProps;

const AddressShare: React.FunctionComponent<TExternalProps> = ({ address, style, ...props }) => {
  const onShare = async () => {
    // TODO: Move `Share` to a module called `interactions-ui`
    await Share.share({
      message: address,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityComponentType="button"
      accessibilityTraits="button"
      style={[styles.wrapper, style]}
      onPress={onShare}
      {...props}
    >
      <View>
        <BodyText style={styles.heading}>Account wallet address</BodyText>
        <HelperText>{address}</HelperText>
      </View>
      <Icon type={EIconType.SHARE} style={styles.icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...shadowStyles.s2,
    ...spacingStyles.p4,
    borderRadius: roundness,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: baseWhite,
  },
  heading: {
    color: grayLighter1,
  },
  icon: {
    ...spacingStyles.ml3,
    color: baseGray,
    width: 20,
    height: 20,
  },
});

export { AddressShare };
