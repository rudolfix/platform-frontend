import { createToken, ECurrency, ENumberInputFormat } from "@neufund/shared-utils";
import React from "react";
import { FormattedDate } from "react-intl";
import {
  Animated,
  Easing,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { EIconType, Icon } from "components/shared/Icon";
import { Eur, MoneyUnsafe } from "components/shared/formatters";
import { HelperText } from "components/shared/typography/HelperText";
import { Text, TextBold } from "components/shared/typography/Text";
import { st } from "components/utils";

import { ETransactionDirection, TTxHistory } from "modules/wallet-screen/module";

import { baseSilver } from "styles/colors";

import { Badge, EBadgeType } from "./Badge";
import { IconSpacer } from "./IconSpacer";
import { getTransactionName } from "./getTransactionName";
import { transactionSharedStyles } from "./transactionSharedStyles";

type TExternalProps = {
  transaction: TTxHistory;
  onPress: (event: GestureResponderEvent) => void;
};

const PendingTransaction: React.FunctionComponent<TExternalProps> = ({ transaction, onPress }) => {
  const progressRef = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    const startAnimation = () => {
      const animation = Animated.timing(progressRef.current, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      Animated.loop(animation).start();
    };

    startAnimation();
  }, []);

  const rotate = progressRef.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const isIncomeTransaction = transaction.transactionDirection === ETransactionDirection.IN;

  return (
    <TouchableOpacity
      style={st(styles.container, transactionSharedStyles.container)}
      activeOpacity={0.4}
      accessibilityComponentType="button"
      accessibilityTraits="button"
      onPress={onPress}
    >
      <>
        <IconSpacer style={st(transactionSharedStyles.spacer, { transform: [{ rotate }] })}>
          <Icon style={[st(transactionSharedStyles.icon)]} type={EIconType.PENDING} />
        </IconSpacer>

        <View style={st(transactionSharedStyles.wrapper)}>
          <View>
            <Text style={transactionSharedStyles.name} numberOfLines={1}>
              {getTransactionName(transaction)}
            </Text>

            <View style={styles.dateAndBadgeWrapper}>
              <HelperText style={transactionSharedStyles.date} numberOfLines={1}>
                <FormattedDate
                  value={transaction.date}
                  year="numeric"
                  month="short"
                  day="numeric"
                />
              </HelperText>
              <Badge type={EBadgeType.PENDING}>Pending</Badge>
            </View>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: baseSilver,
  },
  dateAndBadgeWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
});

export { PendingTransaction };
