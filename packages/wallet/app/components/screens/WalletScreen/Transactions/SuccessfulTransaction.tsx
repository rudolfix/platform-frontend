import { createToken, ECurrency, ENumberInputFormat } from "@neufund/shared-utils";
import React from "react";
import { FormattedDate } from "react-intl";
import { GestureResponderEvent, TouchableOpacity, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { Eur, MoneyUnsafe } from "components/shared/formatters";
import { HelperText } from "components/shared/typography/HelperText";
import { Text, TextBold } from "components/shared/typography/Text";
import { st } from "components/utils";

import { ETransactionDirection, TTxHistory } from "modules/wallet-screen/module";

import { IconSpacer } from "./IconSpacer";
import { getTransactionName } from "./getTransactionName";
import { transactionSharedStyles } from "./transactionSharedStyles";

type TExternalProps = {
  transaction: TTxHistory;
  onPress: (event: GestureResponderEvent) => void;
};

const SuccessfulTransaction: React.FunctionComponent<TExternalProps> = ({
  transaction,
  onPress,
}) => {
  const isIncomeTransaction = transaction.transactionDirection === ETransactionDirection.IN;

  return (
    <TouchableOpacity
      style={st(transactionSharedStyles.container)}
      activeOpacity={0.4}
      accessibilityComponentType="button"
      accessibilityTraits="button"
      onPress={onPress}
    >
      <>
        <IconSpacer style={st(transactionSharedStyles.spacer)}>
          <Icon style={st(transactionSharedStyles.icon)} type={EIconType.PLACEHOLDER} />
        </IconSpacer>

        <View style={st(transactionSharedStyles.wrapper)}>
          <View style={transactionSharedStyles.nameWrapper}>
            <Text style={transactionSharedStyles.name} numberOfLines={1}>
              {getTransactionName(transaction)}
            </Text>

            <HelperText style={transactionSharedStyles.date} numberOfLines={1}>
              <FormattedDate value={transaction.date} year="numeric" month="short" day="numeric" />
            </HelperText>
          </View>

          <View style={st(transactionSharedStyles.valueWrapper)}>
            <TextBold
              style={st(
                [isIncomeTransaction, transactionSharedStyles.valueIn],
                [!isIncomeTransaction, transactionSharedStyles.valueOut],
              )}
              numberOfLines={1}
            >
              {!isIncomeTransaction && <>&minus;</>}
              <MoneyUnsafe
                token={createToken(
                  transaction.currency,
                  transaction.amount,
                  ENumberInputFormat.ULPS,
                )}
              />
            </TextBold>

            {"amountEur" in transaction && (
              <HelperText style={transactionSharedStyles.valueEquivalent} numberOfLines={1}>
                &asymp;{" "}
                <Eur
                  token={createToken(ECurrency.EUR, transaction.amountEur, ENumberInputFormat.ULPS)}
                />
              </HelperText>
            )}
          </View>
        </View>
      </>
    </TouchableOpacity>
  );
};

export { SuccessfulTransaction };
