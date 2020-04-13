import { nonNullable } from "@neufund/shared";
import React from "react";
import { StyleSheet } from "react-native";

import { authModuleAPI } from "../../modules/auth/module";
import { appConnect } from "../../store/utils";
import { spacingStyles } from "../../styles/spacings";
import { Screen } from "../shared/Screen";
import { AddressShare } from "./AddressShare";
import { Avatar } from "./Avatar";

type TStateProps = {
  authWallet: NonNullable<ReturnType<typeof authModuleAPI.selectors.selectAuthWallet>>;
};

const ProfileLayout: React.FunctionComponent<TStateProps> = ({ authWallet }) => (
  <Screen>
    <Avatar name={authWallet.name ?? "Unknown"} style={styles.avatar} />

    <AddressShare address={authWallet.address} style={styles.addressShare} />
  </Screen>
);

const styles = StyleSheet.create({
  avatar: {
    ...spacingStyles.m5,
  },
  addressShare: {
    ...spacingStyles.m4,
  },
});

const ProfileScreen = appConnect<TStateProps>({
  stateToProps: state => ({
    authWallet: nonNullable(authModuleAPI.selectors.selectAuthWallet(state)),
  }),
})(ProfileLayout);

export { ProfileScreen };
