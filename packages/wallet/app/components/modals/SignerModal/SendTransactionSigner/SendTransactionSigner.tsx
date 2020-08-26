import { ETxType } from "@neufund/shared-modules";
import { isInEnum } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { StyleSheet } from "react-native";

import { TxIcons, TxNames } from "components/modals/SignerModal/SendTransactionSigner/constants";
import { SignerContainer } from "components/modals/SignerModal/SignerContainer";
import { EIconType } from "components/shared/Icon";
import { Text } from "components/shared/typography/Text";

import { ESignerType, TSignerRequestData } from "modules/signer-ui/types";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  data: TSignerRequestData[ESignerType.SEND_TRANSACTION];
  approve: () => void;
  reject: () => void;
};

const SendTransactionSigner: React.FunctionComponent<TExternalProps> = ({ data, ...rest }) => {
  let icon = EIconType.BACKUP;
  let headline: React.ReactNode = <FormattedMessage id="wallet.send-tx-signer.tx-name.default" />;
  const transactionType = data.transactionMetaData.transactionType;

  if (isInEnum(ETxType, transactionType)) {
    icon = TxIcons[transactionType];
    headline = TxNames[transactionType];
  }

  return (
    <SignerContainer icon={icon} headline={headline} {...rest}>
      <Text style={styles.body}>Please confirm the transaction to {data.transaction.to}.</Text>
    </SignerContainer>
  );
};

const styles = StyleSheet.create({
  body: {
    ...spacingStyles.ph3,

    textAlign: "center",
    color: grayLighter2,
  },
});

export { SendTransactionSigner };
