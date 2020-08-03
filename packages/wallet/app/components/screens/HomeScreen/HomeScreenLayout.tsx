import { ECurrency, isZero } from "@neufund/shared-utils";
import React from "react";
import { StyleSheet } from "react-native";

import emfluxmotorsBanner from "assets/images/emfluxmotors.png";
import greypBanner from "assets/images/greyp.png";
import icbmBanner from "assets/images/icbm.png";
import myswooopBanner from "assets/images/myswooop.png";
import neufundBanner from "assets/images/neufund.png";
import ngraveBanner from "assets/images/ngrave.png";
import nuCaoBanner from "assets/images/nucao.png";

import { createBalanceUiData } from "components/screens/WalletScreen/utils";
import { EIconType } from "components/shared/Icon";
import { Money } from "components/shared/Money";
import { Asset, EAssetType } from "components/shared/asset/Asset";

import { TBalance } from "modules/home-screen/module";
import { TAsset } from "modules/portfolio-screen/types";

import { EAppRoutes } from "router/appRoutes";
import { useNavigationTyped } from "router/routeUtils";

import { spacingStyles } from "styles/spacings";

import { TToken } from "utils/types";

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
};

const HomeScreenLayout: React.FunctionComponent<TExternalProps> = ({
  balances,
  totalBalanceInEur,
  portfolioAssets: allPortfolioAssets,
  neuBalance,
  neuBalanceEur,
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
        subHeading={
          <Money
            value={totalPortfolioBalanceEur.value}
            currency={totalPortfolioBalanceEur.type}
            decimalPlaces={totalPortfolioBalanceEur.precision}
          />
        }
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
        subHeading={
          <Money
            value={totalBalanceInEur.value}
            currency={totalBalanceInEur.type}
            decimalPlaces={totalBalanceInEur.precision}
          />
        }
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
        <EtoCard
          etoState="Coming Soon"
          companyName="the nu company"
          style={styles.etoCard}
          companyThumbnail={nuCaoBanner}
          categories={["Impact", "Food"]}
          onPress={() =>
            onEtoCardPress(
              "https://platform.neufund.org/eto/view/LI/7900e7fe-8fdf-4930-9798-1bc267f05b2b",
            )
          }
        />
        <EtoCard
          etoState="Proceeds Payout"
          companyName="Grey (GRP)"
          style={styles.etoCard}
          companyThumbnail={greypBanner}
          categories={["Light Electric Vehicles", "Smart Mobility"]}
          onPress={() =>
            onEtoCardPress(
              "https://platform.neufund.org/eto/view/LI/1eb004fd-c44d-4bed-9e76-0e0858649587",
            )
          }
        />
        <EtoCard
          etoState="Proceeds Payout"
          companyName="Neufund (FTH)"
          style={styles.etoCard}
          companyThumbnail={neufundBanner}
          categories={["Technology", "Blockchain"]}
          onPress={() =>
            onEtoCardPress(
              "https://platform.neufund.org/eto/view/DE/efbfc858-0f29-4351-8d07-850b1e0461b8",
            )
          }
        />
        <EtoCard
          etoState="Proceeds Payout"
          companyName="Emuflux Motors"
          style={styles.etoCard}
          companyThumbnail={emfluxmotorsBanner}
          categories={["Mobility", "India"]}
          onPress={() => onEtoCardPress("http://www.emfluxmotors.com/")}
        />
        <EtoCard
          etoState="Coming Soon"
          companyName="My Swoop"
          style={styles.etoCard}
          companyThumbnail={myswooopBanner}
          categories={["Re-commerce", "Germany"]}
          onPress={() => onEtoCardPress("https://www.myswooop.de/")}
        />
        <EtoCard
          etoState="Coming Soon"
          companyName="Ngrave"
          style={styles.etoCard}
          companyThumbnail={ngraveBanner}
          categories={["Blockchain", "Belgium"]}
          onPress={() => onEtoCardPress("https://www.ngrave.io/")}
        />
        <EtoCard
          etoState="Success"
          companyName="NEUFUND ICBM Capital Raise"
          style={styles.etoCard}
          companyThumbnail={icbmBanner}
          categories={["Technology", "Blockchain"]}
          onPress={() => onEtoCardPress("https://commit.neufund.org/")}
        />
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
