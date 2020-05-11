import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { Text, View } from "react-native";

import { EIconType, Icon } from "./Icon";

const iconColor = "black";

storiesOf("Atoms|Icon", module).add("default", () => (
  <View style={{ flexDirection: "row" }}>
    {Object.values(EIconType).map((type, i) => (
      <View style={{ alignItems: "center", justifyContent: "center", margin: 20 }} key={i}>
        <Icon type={type} style={{ color: iconColor }} />
        <Text style={{ color: iconColor }}>{type}</Text>
      </View>
    ))}
  </View>
));
