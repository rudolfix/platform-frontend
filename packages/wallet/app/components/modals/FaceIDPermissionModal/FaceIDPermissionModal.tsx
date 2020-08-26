import { UnknownObject } from "@neufund/shared-utils";
import * as React from "react";
import { StyleSheet } from "react-native";
import { compose } from "recompose";

import { Button, EButtonLayout } from "components/shared/buttons/Button";
import { BottomSheetModal } from "components/shared/modals/BottomSheetModal";
import { BodyText } from "components/shared/typography/BodyText";

import { biometryModuleApi } from "modules/biometry/module";

import { appConnect } from "store/utils";

import { spacingStyles } from "styles/spacings";

type TStateProps = {
  isBiometryAccessRequestRequired: ReturnType<
    typeof biometryModuleApi.selectors.selectIsBiometryAccessRequestRequired
  >;
};

type TDispatchProps = {
  requestFaceIdPermissions: () => void;
};

const FaceIDPermissionModalLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  isBiometryAccessRequestRequired,
  requestFaceIdPermissions,
}) => (
  <BottomSheetModal isVisible={false}>
    <BodyText style={styles.headline}>
      To secure your account, we require your permission to enable Face ID.
    </BodyText>
    <Button layout={EButtonLayout.PRIMARY} onPress={requestFaceIdPermissions}>
      Enable Face ID
    </Button>
  </BottomSheetModal>
);

const styles = StyleSheet.create({
  headline: {
    ...spacingStyles.mt2,
    ...spacingStyles.mb5,
  },
});

const FaceIDPermissionModal = compose<TStateProps & TDispatchProps, UnknownObject>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      isBiometryAccessRequestRequired: biometryModuleApi.selectors.selectIsBiometryAccessRequestRequired(
        state,
      ),
    }),
    dispatchToProps: dispatch => ({
      requestFaceIdPermissions: () =>
        dispatch(biometryModuleApi.actions.requestFaceIdPermissions()),
    }),
  }),
)(FaceIDPermissionModalLayout);

export { FaceIDPermissionModal, FaceIDPermissionModalLayout };
