import * as React from "react";
import { StyleSheet } from "react-native";

import { EIconType } from "components/shared/Icon";
import { Link } from "components/shared/Link";
import { BoldText } from "components/shared/typography/BoldText";
import { Text } from "components/shared/typography/Text";

import { ESignerType, TSignerRequestData } from "modules/signer-ui/types";

import { grayLighter2 } from "styles/colors";
import { spacingStyles } from "styles/spacings";

import { SignerContainer } from "./SignerContainer";

type TExternalProps = {
  data: TSignerRequestData[ESignerType.WC_SESSION_REQUEST];
  approve: () => void;
  reject: () => void;
};

const WCSessionRequestSigner: React.FunctionComponent<TExternalProps> = ({ data, ...rest }) => (
  <SignerContainer icon={EIconType.BACKUP} headline="Connection request" {...rest}>
    <Text style={styles.body}>
      <BoldText>{data.peerName}</BoldText> is requesting to connect to your account via{" "}
      <Link url={data.peerUrl}>{data.peerUrl}</Link>.
    </Text>
  </SignerContainer>
);

const styles = StyleSheet.create({
  body: {
    ...spacingStyles.ph3,

    textAlign: "center",
    color: grayLighter2,
  },
});

export { WCSessionRequestSigner };
