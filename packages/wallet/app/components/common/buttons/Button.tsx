import React from "react";
import { Button as ReactNativeButton } from "react-native";

type TButtonProps = React.ComponentProps<typeof ReactNativeButton>;

const Button: React.FunctionComponent<TButtonProps> = props => {
  return <ReactNativeButton {...props} />;
};

export { Button };
