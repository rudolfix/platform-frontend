import React from "react";
import { Text, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { appRoutes } from "../appRoutes";

const Landing: React.FunctionComponent = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Landing</Text>

      <Button
        testID="landing.go-to-import-your-wallet"
        title="Import your wallet"
        onPress={() => navigation.navigate(appRoutes.importWallet)}
      />
    </View>
  );
};

export { Landing };
