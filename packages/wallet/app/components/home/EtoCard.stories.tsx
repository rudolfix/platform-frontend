import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";

import { EtoCard } from "./EtoCard";

storiesOf("Molecules", module)
  .addDecorator((story: () => React.ReactNode) => <View style={{ padding: 20 }}>{story()}</View>)
  .add("EtoCard", () => (
    <EtoCard
      etoState="Coming Soon"
      companyName="the nu company (NU+)"
      companyThumbnail={require("../../assets/images/nucao.png")}
      categories={["Impact", "Food"]}
    />
  ));
