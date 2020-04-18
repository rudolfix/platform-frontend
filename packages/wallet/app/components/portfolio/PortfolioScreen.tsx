import { toEquityTokenSymbol } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet } from "react-native";

import { spacingStyles } from "../../styles/spacings";
import { Asset, EAssetType } from "../shared/asset/Asset";
import { HeaderScreen } from "../shared/HeaderScreen";

const PortfolioScreen: React.FunctionComponent = () => (
  <HeaderScreen heading={"€6 500.00"} subHeading={"Portfolio balance"} style={styles.container}>
    <Asset
      tokenImage="https://documents.neufund.io/0x74180B56DD74BC56a2E9D5720F39247c55F23328/e36ee175-e8c6-4f8a-9175-1e22b0a8be53.png"
      name="Fifth Force"
      token={toEquityTokenSymbol("FFT")}
      balance="1000"
      analogBalance="15 000"
      analogToken={toEquityTokenSymbol("EUR")}
      style={styles.asset}
      type={EAssetType.RESERVED}
    />

    {Array.from({ length: 15 }, (_, i) => i).map(i => (
      <Asset
        key={i}
        tokenImage="https://documents.neufund.io/0x74180B56DD74BC56a2E9D5720F39247c55F23328/e36ee175-e8c6-4f8a-9175-1e22b0a8be53.png"
        name="Greyp"
        token={toEquityTokenSymbol("GRP")}
        balance="100"
        analogBalance="1 000"
        analogToken={toEquityTokenSymbol("EUR")}
        style={styles.asset}
        type={EAssetType.NORMAL}
      />
    ))}
  </HeaderScreen>
);

const styles = StyleSheet.create({
  container: {
    ...spacingStyles.ph4,
  },
  asset: {
    ...spacingStyles.mb2,
  },
});

export { PortfolioScreen };