import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { EquityToken } from "@neufund/shared";

import { baseWhite, bluish } from "../../../styles/colors";
import { spacingStyles } from "../../../styles/spacings";
import { typographyStyles } from "../../../styles/typography";
import { EIconType } from "../Icon";
import { Panel } from "../panel/Panel";
import { TokenIcon, TokenImage } from "./TokenIcon";
import { BodyBoldText } from "../typography/BodyText";
import { HelperText } from "../forms/layouts/HelperText";

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
  <Panel style={styles.container} {...props}>
    {type === EAssetType.RESERVED && (
      <View style={styles.reservedContainer}>
        <Text style={styles.reservedText}>Reserved</Text>
      </View>
    )}

    <View style={styles.iconAndName}>
      {Object.values<string>(EIconType).includes(tokenImage) ? (
        <TokenIcon style={styles.icon} type={tokenImage as EIconType} />
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
        {balance} {token}
      </BodyBoldText>
      <HelperText style={styles.analogBalanceText}>
        ≈ {analogBalance} {analogToken}
      </HelperText>
    </View>
  </Panel>
);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
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
    lineHeight: 16,
  },
  analogBalanceText: {
    lineHeight: 12,
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
    ...typographyStyles.menuLabelBold,

    color: baseWhite,
    textTransform: "uppercase",
  },
});

export { Asset, EAssetType };
