import { ECurrency, EquityToken, isInEnum } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet, View } from "react-native";

import { EIconType } from "components/shared/Icon";
import { Money } from "components/shared/Money";
import { Skeleton } from "components/shared/animations/Skeleton";
import { Panel } from "components/shared/panel/Panel";
import { BodyBoldText } from "components/shared/typography/BodyText";
import { HelperText } from "components/shared/typography/HelperText";
import { MenuLabelBold } from "components/shared/typography/MenuLabel";

import { baseWhite, bluish } from "styles/colors";
import { spacing2, spacing3, spacingStyles } from "styles/spacings";

import { TToken } from "utils/types";

import { TOKEN_ICON_SIZE, TokenIcon, TokenImage } from "./TokenIcon";

type TPanelProps = React.ComponentProps<typeof Panel>;

enum EAssetType {
  RESERVED = "reserved",
  NORMAL = "normal",
}

type TExternalProps<
  Token extends ECurrency | EquityToken,
  AnalogToken extends ECurrency | EquityToken
> = {
  icon: string | EIconType;
  name: string;
  token: TToken<Token>;
  analogToken: TToken<AnalogToken>;
  type: EAssetType;
} & TPanelProps;

const AssetSkeleton: React.FunctionComponent<React.ComponentProps<typeof Panel>> = props => (
  <Panel contentContainerStyle={styles.panelContent} {...props}>
    <View style={[styles.iconAndName]}>
      <Skeleton style={styles.icon} height={TOKEN_ICON_SIZE} width={TOKEN_ICON_SIZE} />

      <Skeleton height={spacing3} flex={1} />
    </View>
    <View style={[styles.balanceContainer]}>
      <Skeleton height={spacing3} width={"50%"} marginBottom={spacing2} />

      <Skeleton height={spacing2} width={"40%"} />
    </View>
  </Panel>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Asset: React.FunctionComponent<TExternalProps<
  ECurrency | EquityToken,
  ECurrency | EquityToken
>> = ({ name, token, icon, analogToken, type, ...props }) => (
  <Panel contentContainerStyle={styles.panelContent} {...props}>
    {type === EAssetType.RESERVED && (
      <View style={styles.reservedContainer}>
        <MenuLabelBold style={styles.reservedText}>Reserved</MenuLabelBold>
      </View>
    )}

    <View style={styles.iconAndName}>
      {isInEnum(EIconType, icon) ? (
        <TokenIcon style={styles.icon} type={icon} />
      ) : (
        <TokenImage
          style={styles.icon}
          source={{
            uri: icon,
          }}
        />
      )}
      <BodyBoldText>{name}</BodyBoldText>
    </View>
    <View style={styles.balanceContainer}>
      <BodyBoldText style={styles.balanceText}>
        <Money value={token.value} currency={token.type} decimalPlaces={token.precision} />
      </BodyBoldText>
      <HelperText style={styles.analogBalanceText}>
        ≈{" "}
        <Money
          value={analogToken.value}
          currency={analogToken.type}
          decimalPlaces={token.precision}
        />
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
    flex: 1,
  },
  icon: {
    ...spacingStyles.mr3,
  },
  balanceContainer: {
    alignItems: "flex-end",
    flex: 1,
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

export { Asset, EAssetType, AssetSkeleton };
