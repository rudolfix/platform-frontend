import { storiesOf } from "@storybook/react";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { LabelBase } from "./LabelBase";

storiesOf("NDS|Atoms/Input", module).add("LabelBase", () => (
  <IntlProvider>
    <>
      <LabelBase>Lorem ipsum</LabelBase> <br />
      <br />
      <LabelBase isOptional={true}>Lorem Ipsum</LabelBase>
    </>
  </IntlProvider>
));
