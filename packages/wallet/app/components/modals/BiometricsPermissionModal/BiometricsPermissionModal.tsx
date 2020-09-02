import { invariant, UnknownObject } from "@neufund/shared-utils";
import * as React from "react";
import { StyleSheet } from "react-native";
import { compose } from "recompose";

import { biometricsName } from "components/screens/NoBiometricsScreen/NoBiometricsScreen";
import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { BottomSheetModal } from "components/shared/modals/BottomSheetModal";
import { BodyText } from "components/shared/typography/BodyText";
import { EHeadlineLevel, Headline } from "components/shared/typography/Headline";

import { BIOMETRICS_NONE, biometricsModuleApi } from "modules/biometrics/module";

import { appConnect } from "store/utils";

import { spacingStyles } from "styles/spacings";

type TStateProps = {
  isBiometryAccessRequestRequired: ReturnType<
    typeof biometricsModuleApi.selectors.selectIsBiometricsAccessRequestRequired
  >;
  biometryType: ReturnType<typeof biometricsModuleApi.selectors.selectBiometricsType>;
};

type TDispatchProps = {
  requestPermissions: () => void;
};

const BiometricsPermissionModalLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  isBiometryAccessRequestRequired,
  requestPermissions,
  biometryType,
}) => {
  invariant(
    biometryType !== undefined && biometryType !== BIOMETRICS_NONE,
    "Biometrics type should be defined",
  );

  return (
    <BottomSheetModal isVisible={isBiometryAccessRequestRequired}>
      <Headline style={styles.headline} level={EHeadlineLevel.LEVEL3}>
        Account security
      </Headline>
      <BodyText style={styles.paragraph}>
        To secure your account, we require your permission to enable {biometricsName[biometryType]}.
      </BodyText>
      <Button
        style={styles.callToAction}
        layout={EButtonLayout.PRIMARY}
        onPress={requestPermissions}
      >
        Enable {biometricsName[biometryType]}
      </Button>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  headline: {
    ...spacingStyles.mt2,
  },
  paragraph: {
    ...spacingStyles.mt3,
  },
  callToAction: {
    ...spacingStyles.mt4,
  },
});

const BiometricsPermissionModal = compose<TStateProps & TDispatchProps, UnknownObject>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      isBiometryAccessRequestRequired: biometricsModuleApi.selectors.selectIsBiometricsAccessRequestRequired(
        state,
      ),
      biometryType: biometricsModuleApi.selectors.selectBiometricsType(state),
    }),
    dispatchToProps: dispatch => ({
      requestPermissions: () => dispatch(biometricsModuleApi.actions.requestPermissions()),
    }),
  }),
)(BiometricsPermissionModalLayout);

export { BiometricsPermissionModal, BiometricsPermissionModalLayout };
