import * as React from "react";
import { Text } from "react-native";

import { typographyStyles } from "../../../styles/typography";

type TExternalProps = React.ComponentProps<typeof Text>;

const BodyText: React.FunctionComponent<TExternalProps> = ({ children, style, ...props }) => (
  <Text style={[typographyStyles.body, style]} {...props}>
    {children}
  </Text>
);

const BodyBoldText: React.FunctionComponent<TExternalProps> = ({ children, style, ...props }) => (
  <Text style={[typographyStyles.bodyBold, style]} {...props}>
    {children}
  </Text>
);

export { BodyText, BodyBoldText };
