import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";

import { FaceIDPermissionModalLayout } from "./FaceIDPermissionModal";

storiesOf("Templates|FaceIDPermissionModal", module).add(
  "Request Face ID permissions modal",
  () => (
    <FaceIDPermissionModalLayout
      isBiometryAccessRequestRequired
      requestFaceIdPermissions={action("requestFaceIdPermissions")}
    />
  ),
);
