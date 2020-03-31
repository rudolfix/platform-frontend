import * as React from "react";
import { storiesOf } from "@storybook/react-native";

import { EFieldType, Field } from "./Field";

storiesOf("Molecules|Field", module)
  .add("default input", () => (
    <Field
      label="User name"
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("default input without label", () => (
    <Field
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("invalid input", () => (
    <Field
      label="User name"
      type={EFieldType.INPUT}
      value="desfero"
      helperText="It's an important information for us to provide the best user experience"
      errorMessage="User name already in use"
    />
  ))
  .add("disabled input", () => (
    <Field label="User name" type={EFieldType.INPUT} disabled={true} value="desfero" />
  ))
  .add("textarea ", () => (
    <Field
      label="User name"
      type={EFieldType.TEXT_AREA}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ));
