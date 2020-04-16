import React from "react";
import { View } from "react-native";
import { EquityToken } from "@neufund/shared";

import { Panel } from "../panel/Panel";
import { TokenIcon } from "../TokenIcon";
import { BodyBoldText } from "../typography/BodyText";
import { HelperText } from "../forms/layouts/HelperText";

type TPanelProps = React.ComponentProps<typeof Panel>;

type TExternalProps = {
  name: string;
  balance: string;
  token: EquityToken;
  tokenImage: string;
  analogBalance: string;
  analogToken: EquityToken;
} & TPanelProps;

const Asset: React.FunctionComponent<TExternalProps> = ({
  name,
  balance,
  token,
  tokenImage,
  analogBalance,
  analogToken,
  ...props
}) => (
  <Panel {...props}>
    <View>
      <TokenIcon
        source={{
          uri: tokenImage,
        }}
      />
      <BodyBoldText>{name}</BodyBoldText>
    </View>
    <View>
      <BodyBoldText>
        {balance} {token}
      </BodyBoldText>
      <HelperText>
        ≈ {analogBalance} {analogToken}
      </HelperText>
    </View>
  </Panel>
);

export { Asset };
