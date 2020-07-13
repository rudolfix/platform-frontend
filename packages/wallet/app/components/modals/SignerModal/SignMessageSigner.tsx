import * as React from "react";
import { StyleSheet } from "react-native";

import { EIconType } from "components/shared/Icon";
import { Text } from "components/shared/typography/Text";

import { ESignerType, TSignerRequestData } from "modules/signer-ui/types";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { SignerContainer } from "./SignerContainer";

type TExternalProps = {
  data: TSignerRequestData[ESignerType.SIGN_MESSAGE];
  approve: () => void;
  reject: () => void;
};

const SignMessageSigner: React.FunctionComponent<TExternalProps> = ({ data: _data, ...rest }) => (
  <SignerContainer icon={EIconType.BACKUP} headline="Sign message request" {...rest}>
    <Text style={styles.body}>Please confirm message request.</Text>
  </SignerContainer>
);

const styles = StyleSheet.create({
  body: {
    ...spacingStyles.ph3,

    textAlign: "center",
    color: grayLighter2,
  },
});

export { SignMessageSigner };
