import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";

import { EHeadlineLevel, Headline } from "./Headline";
import { BodyBoldText, BodyText } from "./BodyText";
import { Text } from "./Text";

storiesOf("Molecules", module)
  .addDecorator((story: () => React.ReactNode) => <View style={{ padding: 25 }}>{story()}</View>)
  .add("Typography", () => (
    <>
      <Headline level={EHeadlineLevel.LEVEL1}>Headline 1</Headline>
      <Headline level={EHeadlineLevel.LEVEL2}>Headline 2</Headline>
      <Headline level={EHeadlineLevel.LEVEL3}>Headline 3</Headline>
      <Headline level={EHeadlineLevel.LEVEL4}>Headline 4</Headline>
      <BodyText>Body text</BodyText>
      <BodyBoldText>Body bold text</BodyBoldText>
      <Text>Text</Text>
    </>
  ));
