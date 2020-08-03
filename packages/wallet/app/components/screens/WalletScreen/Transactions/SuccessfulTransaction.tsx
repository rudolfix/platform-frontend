import { ECurrency } from "@neufund/shared-utils";
import React from "react";
import { FormattedDate } from "react-intl";
import { GestureResponderEvent, StyleSheet, TouchableOpacity, View } from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { Money } from "components/shared/Money";
import { HelperText } from "components/shared/typography/HelperText";
import { Text, TextBold } from "components/shared/typography/Text";
import { st } from "components/utils";

import { ETransactionDirection, TTxHistory } from "modules/wallet-screen/module";

import { baseGray, baseGreen, blueyGray } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { IconSpacer } from "./IconSpacer";
import { getTransactionName } from "./getTransactionName";

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
      style={st(styles.container)}
      activeOpacity={0.4}
      accessibilityComponentType="button"
      accessibilityTraits="button"
      onPress={onPress}
    >
      <>
        <IconSpacer style={st(styles.spacer)}>
          <Icon style={st(styles.icon)} type={EIconType.PLACEHOLDER} />
        </IconSpacer>

        <View style={st(styles.wrapper)}>
          <View style={styles.nameWrapper}>
            <Text style={styles.name} numberOfLines={1}>
              {getTransactionName(transaction)}
            </Text>

            <HelperText style={styles.date} numberOfLines={1}>
              <FormattedDate value={transaction.date} year="numeric" month="short" day="numeric" />
            </HelperText>
          </View>

          <View>
            <TextBold
              style={st(
                [isIncomeTransaction, styles.valueIn],
                [!isIncomeTransaction, styles.valueOut],
              )}
              numberOfLines={1}
            >
              {!isIncomeTransaction && <>&minus;</>}
              <Money
                currency={transaction.currency}
                value={transaction.amount}
                decimalPlaces={18}
              />
            </TextBold>

            {"amountEur" in transaction && (
              <HelperText style={styles.valueEquivalent} numberOfLines={1}>
                &asymp;{" "}
                <Money currency={ECurrency.EUR} value={transaction.amountEur} decimalPlaces={18} />
              </HelperText>
            )}
          </View>
        </View>
      </>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
  },
  spacer: { alignSelf: "center" },
  icon: {
    color: baseGray,
    width: "100%",
    height: "100%",
  },
  wrapper: {
    ...spacingStyles.pr4,

    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameWrapper: {
    flexShrink: 1,
  },
  name: {
    color: baseGray,
  },
  date: {
    color: blueyGray,
  },
  valueIn: {
    color: baseGreen,
  },
  valueOut: {
    color: baseGray,
  },
  valueEquivalent: {
    color: blueyGray,
  },
});

export { SuccessfulTransaction };
