import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { EBiometricsType } from "modules/biometrics/types";

import { BiometricsPermissionModalLayout } from "./BiometricsPermissionModal";

storiesOf("Templates|BiometricsPermissionModal", module).add(
  "Request Face ID permissions modal",
  () => (
    <BiometricsPermissionModalLayout
      isBiometryAccessRequestRequired
      requestPermissions={action("requestFaceIdPermissions")}
      biometryType={EBiometricsType.IOSFaceID}
    />
  ),
);
