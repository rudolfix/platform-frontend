import { ECurrency } from "@neufund/shared-utils";
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
import { Money } from "components/shared/Money";
import { HelperText } from "components/shared/typography/HelperText";
import { Text, TextBold } from "components/shared/typography/Text";
import { st } from "components/utils";

import { ETransactionDirection, TTxHistory } from "modules/wallet-screen/module";

import { baseGray, baseGreen, baseSilver, blueyGray } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { Badge, EBadgeType } from "./Badge";
import { IconSpacer } from "./IconSpacer";
import { getTransactionName } from "./getTransactionName";

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
      style={st(styles.container)}
      activeOpacity={0.4}
      accessibilityComponentType="button"
      accessibilityTraits="button"
      onPress={onPress}
    >
      <>
        <IconSpacer style={st(styles.spacer, { transform: [{ rotate }] })}>
          <Icon style={[st(styles.icon)]} type={EIconType.PENDING} />
        </IconSpacer>

        <View style={st(styles.wrapper)}>
          <View>
            <Text style={styles.name} numberOfLines={1}>
              {getTransactionName(transaction)}
            </Text>

            <View style={styles.dateAndBadgeWrapper}>
              <HelperText style={styles.date} numberOfLines={1}>
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
    backgroundColor: baseSilver,
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
  name: {
    color: baseGray,
  },
  dateAndBadgeWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  date: {
    ...spacingStyles.mr1,

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

export { PendingTransaction };
