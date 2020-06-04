import { EquityToken, isInEnum } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, View } from "react-native";

import { EIconType } from "components/shared/Icon";
import { Money } from "components/shared/Money";
import { Panel } from "components/shared/panel/Panel";
import { BodyBoldText } from "components/shared/typography/BodyText";
import { HelperText } from "components/shared/typography/HelperText";
import { MenuLabelBold } from "components/shared/typography/MenuLabel";

import { baseWhite, bluish } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { TokenIcon, TokenImage } from "./TokenIcon";

type TPanelProps = React.ComponentProps<typeof Panel>;

enum EAssetType {
  RESERVED = "reserved",
  NORMAL = "normal",
}

type TExternalProps = {
  name: string;
  balance: string;
  token: EquityToken;
  tokenImage: string | EIconType;
  analogBalance: string;
  analogToken: EquityToken;
  type: EAssetType;
} & TPanelProps;

const Asset: React.FunctionComponent<TExternalProps> = ({
  name,
  balance,
  token,
  tokenImage,
  analogBalance,
  analogToken,
  type,
  ...props
}) => (
  <Panel contentContainerStyle={styles.panelContent} {...props}>
    {type === EAssetType.RESERVED && (
      <View style={styles.reservedContainer}>
        <MenuLabelBold style={styles.reservedText}>Reserved</MenuLabelBold>
      </View>
    )}

    <View style={styles.iconAndName}>
      {isInEnum(EIconType, tokenImage) ? (
        <TokenIcon style={styles.icon} type={tokenImage} />
      ) : (
        <TokenImage
          style={styles.icon}
          source={{
            uri: tokenImage,
          }}
        />
      )}
      <BodyBoldText>{name}</BodyBoldText>
    </View>
    <View style={styles.balanceContainer}>
      <BodyBoldText style={styles.balanceText}>
        <Money value={balance} currency={token} decimalPlaces={18} />
      </BodyBoldText>
      <HelperText style={styles.analogBalanceText}>
        ≈ <Money value={analogBalance} currency={analogToken} decimalPlaces={18} />
      </HelperText>
    </View>
  </Panel>
);

const styles = StyleSheet.create({
  panelContent: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  iconAndName: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    ...spacingStyles.mr3,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceText: {
    lineHeight: 18,
  },
  analogBalanceText: {
    lineHeight: 14,
  },
  reservedContainer: {
    backgroundColor: bluish,

    paddingHorizontal: 30,
    paddingVertical: 2,

    position: "absolute",
    left: -32,
    top: 12,
    zIndex: 1,
    transform: [{ rotate: "-45deg" }],
  },
  reservedText: {
    color: baseWhite,
    textTransform: "uppercase",
  },
});

export { Asset, EAssetType };
