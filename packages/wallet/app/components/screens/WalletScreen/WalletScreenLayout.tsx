import { useActionSheet } from "@expo/react-native-action-sheet";
import { ECurrency, EthereumTxHash, toEthereumTxHash, TToken } from "@neufund/shared-utils";
import * as React from "react";
import { Linking, StyleSheet, View } from "react-native";

import { createBalanceUiData } from "components/screens/WalletScreen/utils";
import { HeaderScreen } from "components/shared/HeaderScreen";
import { INDICATOR_SIZE, LoadingIndicator } from "components/shared/LoadingIndicator";
import { Asset, EAssetType } from "components/shared/asset/Asset";
import { Eur } from "components/shared/formatters";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";
import { st } from "components/utils";

import { etherscanTxLink } from "config/externalRoutes";

import { TBalance, TxHistoryPaginated } from "modules/wallet-screen/module";

import { spacingStyles } from "styles/spacings";

import { Transactions } from "./Transactions/Transactions";
import { ETransactionKind } from "./Transactions/types";

type TExternalProps = {
  balances: TBalance[];
  transactionsHistoryPaginated: TxHistoryPaginated;
  loadTxHistoryNext: () => void;
  totalBalanceInEur: TToken<ECurrency.EUR>;
};

const WalletScreenLayout: React.FunctionComponent<TExternalProps> = ({
  transactionsHistoryPaginated,
  loadTxHistoryNext,
  balances,
  totalBalanceInEur,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();

  const formattedBalances = React.useMemo(() => balances.map(createBalanceUiData), [balances]);

  const showActionSheet = (txHash: EthereumTxHash) => {
    const viewOnEtherscan = "View on Etherscan";
    const cancel = "Cancel";

    const options = [viewOnEtherscan, cancel];
    const cancelButtonIndex = options.indexOf(cancel);

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        if (buttonIndex === options.indexOf(viewOnEtherscan)) {
          await Linking.openURL(etherscanTxLink(txHash));
        }
      },
    );
  };

  return (
    <HeaderScreen heading={<Eur token={totalBalanceInEur} />} subHeading={"Wallet balance"}>
      {props => (
        <Transactions
          onTransactionPress={transaction => showActionSheet(toEthereumTxHash(transaction.txHash))}
          ListHeaderComponent={
            <>
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

              <Headline style={[styles.headline]} level={EHeadlineLevel.LEVEL4}>
                Transactions
              </Headline>
            </>
          }
          onEndReached={transactionsHistoryPaginated.canLoadMore ? loadTxHistoryNext : undefined}
          ListFooterComponent={
            <View
              style={st([
                transactionsHistoryPaginated.canLoadMore,
                styles.loadingIndicatorContainer,
              ])}
            >
              {transactionsHistoryPaginated.isLoading && (
                <LoadingIndicator style={styles.loadingIndicator} />
              )}
            </View>
          }
          data={
            transactionsHistoryPaginated.transactions?.map(transaction => ({
              ...transaction,
              kind: ETransactionKind.SUCCESSFUL,
            })) ?? []
          }
          {...props}
        />
      )}
    </HeaderScreen>
  );
};

const styles = StyleSheet.create({
  asset: {
    ...spacingStyles.mb2,
    ...spacingStyles.mh4,
  },
  headline: {
    ...spacingStyles.mt4,
    ...spacingStyles.mh4,
    ...spacingStyles.mb2,
  },
  loadingIndicatorContainer: {
    height: INDICATOR_SIZE * 3,
  },
  loadingIndicator: {
    ...spacingStyles.mv3,

    alignSelf: "center",
  },
});

export { WalletScreenLayout, styles };
