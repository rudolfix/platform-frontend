import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";

import { EIconType } from "components/shared/Icon";
import { LineBreak } from "components/shared/LineBreak";

import { ButtonIcon } from "./ButtonIcon";

storiesOf("Atoms|ButtonIcon", module)
  .addDecorator((story: () => React.ReactNode) => <View style={{ padding: 20 }}>{story()}</View>)
  .add("default", () => (
    <>
      <ButtonIcon
        icon={EIconType.HOME}
        onPress={action("onPress")}
        accessibilityLabel="Go to Home"
        accessibilityHint="Returns back to the main screen"
      />

      <LineBreak />

      <ButtonIcon
        icon={EIconType.HOME}
        disabled
        onPress={action("onPress")}
        accessibilityLabel="Go to Home"
        accessibilityHint="Returns back to the main screen"
      />

      <LineBreak />

      <ButtonIcon
        icon={EIconType.HOME}
        loading
        onPress={action("onPress")}
        accessibilityLabel="Go to Home"
        accessibilityHint="Returns back to the main screen"
      />
    </>
  ));
