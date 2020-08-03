import { ECurrency, isZero } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet } from "react-native";

import { HeaderScreen } from "components/shared/HeaderScreen";
import { EIconType } from "components/shared/Icon";
import { Money } from "components/shared/Money";
import { Screen } from "components/shared/Screen";
import { Asset, EAssetType } from "components/shared/asset/Asset";

import { TAsset } from "modules/portfolio-screen/module";

import { spacingStyles } from "styles/spacings";

import { TToken } from "utils/types";

type TExternalProps = {
  assets: TAsset[];
  pendingAssets: TAsset[];
  neuBalance: TToken<ECurrency.NEU>;
  neuBalanceEur: TToken<ECurrency.EUR>;
  totalBalanceEur: TToken<ECurrency.EUR>;
};

const PortfolioScreenLayout: React.FunctionComponent<TExternalProps> = ({
  pendingAssets,
  assets: allAssets,
  totalBalanceEur,
  neuBalanceEur,
  neuBalance,
}) => {
  const myAssets = allAssets.filter(asset => !isZero(asset.token.value));

  // in case user do not own assets show all available assets
  // in case user own just Neu token show just Neu token
  const assets = myAssets.length > 0 || !isZero(neuBalance.value) ? myAssets : allAssets;

  return (
    <HeaderScreen
      heading={
        <Money
          value={totalBalanceEur.value}
          currency={totalBalanceEur.type}
          decimalPlaces={totalBalanceEur.precision}
        />
      }
      subHeading={"Portfolio balance"}
    >
      {screenProps => (
        <Screen {...screenProps}>
          {pendingAssets.map(asset => (
            <Asset
              key={asset.id}
              icon={asset.tokenImage}
              name={asset.tokenName}
              token={asset.token}
              analogToken={asset.analogToken}
              style={styles.asset}
              type={EAssetType.RESERVED}
            />
          ))}

          {assets.map(asset => (
            <Asset
              key={asset.id}
              icon={asset.tokenImage}
              name={asset.tokenName}
              token={asset.token}
              analogToken={asset.analogToken}
              style={styles.asset}
              type={EAssetType.NORMAL}
            />
          ))}

          <Asset
            icon={EIconType.NEU}
            name="Neumark"
            token={neuBalance}
            analogToken={neuBalanceEur}
            style={styles.asset}
            type={EAssetType.NORMAL}
          />
        </Screen>
      )}
    </HeaderScreen>
  );
};

const styles = StyleSheet.create({
  asset: {
    ...spacingStyles.mh4,
    ...spacingStyles.mb2,
  },
});

export { PortfolioScreenLayout, styles };
