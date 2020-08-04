import { assertNever } from "@neufund/shared-utils";
import React from "react";
import { Animated, StyleSheet } from "react-native";

import { PendingTransaction } from "components/screens/WalletScreen/Transactions/PendingTransaction";
import { SuccessfulTransaction } from "components/screens/WalletScreen/Transactions/SuccessfulTransaction";
import { ETransactionKind, TTransaction } from "components/screens/WalletScreen/Transactions/types";
import { BodyText } from "components/shared/typography/BodyText";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { ItemSeparatorComponent } from "./ItemSeparatorComponent";
import { getTxUniqueId } from "./utils";

declare class TypedFlatList extends Animated.FlatList<TTransaction> {}
type TFlatList = React.ComponentProps<typeof TypedFlatList>;

type TExternalProps = {
  onTransactionPress: (transaction: TTransaction) => void;
} & Omit<TFlatList, "renderItem">;

const ListEmptyComponent: React.FunctionComponent = () => (
  <BodyText style={styles.noTransactions}>You don’t have any transactions yet.</BodyText>
);

type TSeparatorProps = {
  leadingItem: TTransaction;
};

const ItemSeparatorComponentContainer: React.FunctionComponent<TSeparatorProps> = ({
  leadingItem,
}: TSeparatorProps) =>
  leadingItem.kind !== ETransactionKind.PENDING ? <ItemSeparatorComponent /> : null;

const Transactions: React.FunctionComponent<TExternalProps> = ({
  onTransactionPress,
  ...props
}) => (
  <Animated.FlatList
    ItemSeparatorComponent={ItemSeparatorComponentContainer}
    keyExtractor={getTxUniqueId}
    onEndReachedThreshold={0.15}
    ListEmptyComponent={ListEmptyComponent}
    renderItem={({ item }: { item: TTransaction }) => {
      switch (item.kind) {
        case ETransactionKind.SUCCESSFUL:
          return (
            <SuccessfulTransaction transaction={item} onPress={() => onTransactionPress(item)} />
          );
        case ETransactionKind.PENDING:
          return <PendingTransaction transaction={item} onPress={() => onTransactionPress(item)} />;

        default:
          assertNever(item, "Not supported transaction type");
      }
    }}
    {...props}
  />
);

const styles = StyleSheet.create({
  noTransactions: {
    ...spacingStyles.mh4,
    color: grayLighter2,
  },
});

export { Transactions };
