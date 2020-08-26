import { TEtoWithCompanyAndContract } from "@neufund/shared-modules";
import { ECurrency, isZero, TToken } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet } from "react-native";

import { createBalanceUiData } from "components/screens/WalletScreen/utils";
import { EIconType } from "components/shared/Icon";
import { Asset, EAssetType } from "components/shared/asset/Asset";
import { Eur } from "components/shared/formatters";

import { platformEtoLink } from "config/externalRoutes";

import { TBalance } from "modules/home-screen/module";
import { TAsset } from "modules/portfolio-screen/types";

import { EAppRoutes } from "router/appRoutes";
import { useNavigationTyped } from "router/routeUtils";

import { spacingStyles } from "styles/spacings";

import { EtoCard } from "./EtoCard";
import { HomeScreenLayoutContainer } from "./HomeScreenLayoutContainer";
import { Section } from "./Section";

/**
 * Specifies the maximum amount of portfolio items shown
 */
const PORTFOLIO_ASSETS_COUNT = 2;

type TExternalProps = {
  balances: TBalance[];
  totalBalanceInEur: TToken<ECurrency.EUR>;
  portfolioAssets: TAsset[];
  neuBalance: TToken<ECurrency.NEU>;
  neuBalanceEur: TToken<ECurrency.EUR>;
  totalPortfolioBalanceEur: TToken<ECurrency.EUR>;
  etos: TEtoWithCompanyAndContract[];
};

const HomeScreenLayout: React.FunctionComponent<TExternalProps> = ({
  balances,
  totalBalanceInEur,
  portfolioAssets: allPortfolioAssets,
  neuBalance,
  neuBalanceEur,
  etos,
  totalPortfolioBalanceEur,
}) => {
  const myPortfolioAssets = allPortfolioAssets.filter(asset => !isZero(asset.token.value));

  // in case user do not own assets show all available assets
  // in case user own just Neu token show just Neu token
  const portfolioAssets =
    myPortfolioAssets.length > 0 || !isZero(neuBalance.value)
      ? myPortfolioAssets
      : allPortfolioAssets;

  const navigation = useNavigationTyped();

  const onEtoCardPress = (uri: string) => {
    navigation.navigate(EAppRoutes.webView, { uri });
  };

  const formattedBalances = React.useMemo(() => balances.map(createBalanceUiData), [balances]);

  return (
    <HomeScreenLayoutContainer>
      <Section
        heading="Portfolio"
        subHeading={<Eur token={totalPortfolioBalanceEur} />}
        style={styles.section}
      >
        {portfolioAssets.slice(0, PORTFOLIO_ASSETS_COUNT).map(asset => (
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
      </Section>

      <Section
        heading="Wallet"
        subHeading={<Eur token={totalBalanceInEur} />}
        style={styles.section}
      >
        {formattedBalances.map(balance => (
          <Asset
            key={balance.type}
            icon={balance.icon}
            name={balance.name}
            token={balance.token}
            analogToken={balance.euroEquivalentToken}
            style={styles.asset}
            type={EAssetType.NORMAL}
          />
        ))}
      </Section>

      <Section heading="Investment Opportunities" style={styles.section}>
        {etos.map(eto => (
          <EtoCard
            key={eto.etoId}
            eto={eto}
            style={styles.etoCard}
            onPress={() => {
              onEtoCardPress(platformEtoLink(eto.previewCode, eto.product.jurisdiction));
            }}
          />
        ))}
      </Section>
    </HomeScreenLayoutContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    ...spacingStyles.ph4,
    ...spacingStyles.mb4,
  },
  asset: {
    ...spacingStyles.mb2,
  },
  etoCard: {
    ...spacingStyles.mb4,
  },
});

export { HomeScreenLayout, styles };
