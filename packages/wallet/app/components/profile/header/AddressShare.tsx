import { EthereumAddressWithChecksum } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, View, Share } from "react-native";

import { baseGray, grayLighter1 } from "../../styles/colors";
import { spacingStyles } from "../../styles/spacings";
import { EIconType, Icon } from "../shared/Icon";
import { HelperText } from "../shared/forms/layouts/HelperText";
import { PanelTouchable } from "../shared/panel/Panel";
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
    <PanelTouchable onPress={onShare} style={style} {...props}>
      <View>
        <BodyText style={styles.heading}>Account wallet address</BodyText>
        <HelperText>{address}</HelperText>
      </View>
      <Icon type={EIconType.SHARE} style={styles.icon} />
    </PanelTouchable>
  );
};

const styles = StyleSheet.create({
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
