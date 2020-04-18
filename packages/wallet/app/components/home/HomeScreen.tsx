import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";

import { appRoutes } from "../../appRoutes";
import { appConnect } from "../../store/utils";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { SafeAreaScreen } from "../shared/Screen";

type TStateProps = {};

const HomeLayout: React.FunctionComponent<TStateProps> = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaScreen>
      <View>
        <Button
          layout={EButtonLayout.PRIMARY}
          testID="landing.go-to-qr-code-scanner"
          onPress={() => navigation.navigate(appRoutes.qrCode)}
        >
          Scan QR code
        </Button>
      </View>
    </SafeAreaScreen>
  );
};

const HomeScreen = appConnect<TStateProps>({
  stateToProps: () => ({}),
})(HomeLayout);

export { HomeScreen };
