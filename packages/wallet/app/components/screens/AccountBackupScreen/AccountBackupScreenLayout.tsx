import React from "react";
import { StyleSheet, Animated } from "react-native";

import { RecoveryPhrase } from "components/screens/AccountBackupScreen/RecoveryPhrase";
import { EWalletUIType, TWalletUI } from "components/screens/AccountBackupScreen/types";
import { LineBreak } from "components/shared/LineBreak";
import { SafeAreaScreen } from "components/shared/Screen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { Panel } from "components/shared/panel/Panel";
import { BodyText } from "components/shared/typography/BodyText";
import { CodeText } from "components/shared/typography/CodeText";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  data: TWalletUI;
  onTypeChange: (type: EWalletUIType) => void;
  allowedTypes: EWalletUIType[];
};

const typeToText: Record<EWalletUIType, string> = {
  [EWalletUIType.MNEMONIC]: "Show recovery phrase",
  [EWalletUIType.PRIVATE_KEY]: "Show private key",
};

const Data: React.FunctionComponent<TExternalProps> = ({ data, allowedTypes, onTypeChange }) => {
  const animationRef = React.useRef(new Animated.Value(0));

  React.useLayoutEffect(() => {
    animationRef.current.setValue(0);

    Animated.timing(animationRef.current, {
      toValue: 1,
      duration: 400,
    }).start();
  }, [data.type]);

  return (
    <Animated.View
      style={[
        {
          opacity: animationRef.current, // Bind opacity to animated value
        },
      ]}
    >
      <Panel>
        {data.type === EWalletUIType.MNEMONIC && <RecoveryPhrase mnemonic={data.value} />}
        {data.type === EWalletUIType.PRIVATE_KEY && (
          // do not allow selecting text and coping to clipboard
          <CodeText selectable={false}>{data.value}</CodeText>
        )}

        {allowedTypes
          .filter(value => value !== data.type)
          .map(type => (
            <Button
              style={styles.button}
              key={type}
              layout={EButtonLayout.TEXT}
              onPress={() => onTypeChange(type)}
            >
              {typeToText[type]}
            </Button>
          ))}
      </Panel>
    </Animated.View>
  );
};

const AccountBackupScreenLayout: React.FunctionComponent<TExternalProps> = props => {
  return (
    <SafeAreaScreen contentContainerStyle={styles.content} testID="account-backup-screen.layout">
      <BodyText style={styles.text}>
        If you lose access to your device, the only way to restore your funds and account is with
        your recovery phrase or private key.
        <LineBreak />
        <LineBreak />
        Please write down and store it in a safe place.
      </BodyText>

      <Data {...props} />
    </SafeAreaScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    ...spacingStyles.p4,
  },
  text: {
    ...spacingStyles.mb5,

    color: grayLighter2,
  },
  button: {
    ...spacingStyles.mt4,
  },
});

export { AccountBackupScreenLayout };
