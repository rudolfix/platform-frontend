import { ECurrency, toEquityTokenSymbol } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet } from "react-native";

import { HeaderScreen } from "components/shared/HeaderScreen";
import { Screen } from "components/shared/Screen";
import { Asset, EAssetType } from "components/shared/asset/Asset";

import { spacingStyles } from "styles/spacings";

import { createToken } from "utils/createToken";

const PortfolioScreen: React.FunctionComponent = () => (
  <HeaderScreen heading={"€6 500.00"} subHeading={"Portfolio balance"}>
    {screenProps => (
      <Screen {...screenProps}>
        <Asset
          icon="https://documents.neufund.io/0x95137084d1b6F58D177523De894293913394aA12/9066455f-e514-444d-bd4f-44e4df3f2a74.png"
          name="Nomera Tech"
          token={createToken(toEquityTokenSymbol("NOM"), "1000", 0)}
          analogToken={createToken(ECurrency.EUR, "15000", 0)}
          style={styles.asset}
          type={EAssetType.RESERVED}
        />

        {Array.from({ length: 15 }, (_, i) => i).map(i => (
          <Asset
            key={i}
            icon="https://documents.neufund.io/0x74180B56DD74BC56a2E9D5720F39247c55F23328/e36ee175-e8c6-4f8a-9175-1e22b0a8be53.png"
            name="Greyp"
            token={createToken(toEquityTokenSymbol("GRP"), "100", 0)}
            analogToken={createToken(ECurrency.EUR, "1000", 0)}
            style={styles.asset}
            type={EAssetType.NORMAL}
          />
        ))}
      </Screen>
    )}
  </HeaderScreen>
);

const styles = StyleSheet.create({
  asset: {
    ...spacingStyles.mh4,
    ...spacingStyles.mb2,
  },
});

export { PortfolioScreen };
