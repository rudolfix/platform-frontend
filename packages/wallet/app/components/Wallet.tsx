import * as React from "react";
import { SafeAreaView, Text } from "react-native";

const Wallet: React.FunctionComponent = () => {
  return (
    <SafeAreaView>
      <Text testID="wallet">Wallet</Text>
    </SafeAreaView>
  );
};

export { Wallet };
