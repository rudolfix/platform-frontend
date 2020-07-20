import chunk from "lodash/fp/chunk";
import * as React from "react";
import { StyleSheet, View } from "react-native";

import { CodeText } from "components/shared/typography/CodeText";
import { HelperText } from "components/shared/typography/HelperText";
import { st } from "components/utils";

import { spacingStyles } from "styles/spacings";

const MNEMONICS_IN_ROW = 3;

type TExternalProps = {
  mnemonic: string[];
};

const RecoveryPhrase: React.FunctionComponent<TExternalProps> = ({ mnemonic }) => {
  const mnemonicChunks = chunk(MNEMONICS_IN_ROW, mnemonic);

  return (
    <View style={styles.container}>
      {mnemonicChunks.map((items, i) => (
        <View
          key={items.join()}
          style={st(styles.row, [i === mnemonicChunks.length - 1, styles.rowLast])}
        >
          {items.map((item, j) => (
            <View style={st(styles.item)} key={item}>
              <HelperText style={styles.itemIndex}>{i * MNEMONICS_IN_ROW + j + 1}</HelperText>
              {/* do not allow selecting text and coping to clipboard */}
              <CodeText selectable={false}>{item}</CodeText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    ...spacingStyles.mb4,

    flexDirection: "row",
    alignItems: "center",
  },
  rowLast: {
    marginBottom: 0,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemIndex: {
    ...spacingStyles.mr2,
  },
});

export { RecoveryPhrase };
