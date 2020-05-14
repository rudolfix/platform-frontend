import { nonNullable } from "@neufund/shared-utils";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Config from "react-native-config";

import { appRoutes } from "../../appRoutes";
import { authModuleAPI } from "../../modules/auth/module";
import { appConnect } from "../../store/utils";
import { spacingStyles } from "../../styles/spacings";
import { EIconType } from "../shared/Icon";
import { Screen } from "../shared/Screen";
import { AddressShare } from "./AddressShare";
import { Avatar } from "./Avatar";
import { Menu, EMenuItemType } from "../shared/menu/Menu";

type TStateProps = {
  authWallet: NonNullable<ReturnType<typeof authModuleAPI.selectors.selectAuthWallet>>;
};

type TMenuProps = React.ComponentProps<typeof Menu>;

const ProfileLayout: React.FunctionComponent<TStateProps> = ({ authWallet }) => {
  const navigation = useNavigation();

  const items = React.useMemo(() => {
    const defaultItems: TMenuProps["items"] = [];

    if (Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost") {
      return defaultItems.concat([
        {
          id: "switch-account",
          type: EMenuItemType.BUTTON,
          heading: "Switch account",
          helperText: authWallet.name,
          icon: EIconType.WALLET,
          onPress: () => navigation.navigate(appRoutes.switchAccount),
        },
      ]);
    }

    return defaultItems;
  }, []);

  return (
    <Screen>
      <View style={styles.menuHeader}>
        <Avatar name={authWallet.name} />

        <AddressShare address={authWallet.address} style={styles.addressShare} />
      </View>

      <Menu items={items} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  menuHeader: {
    ...spacingStyles.mh4,
    ...spacingStyles.mv5,
  },
  addressShare: {
    ...spacingStyles.mt5,
  },
});

const ProfileScreen = appConnect<TStateProps>({
  stateToProps: state => ({
    authWallet: nonNullable(authModuleAPI.selectors.selectAuthWallet(state)),
  }),
})(ProfileLayout);

export { ProfileScreen };
