import * as React from "react";
import { storiesOf } from "@storybook/react-native";

import { EFieldType, FieldLayout } from "./FieldLayout";

storiesOf("Molecules|FieldLayout", module)
  .add("default input", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("default input without label", () => (
    <FieldLayout
      type={EFieldType.INPUT}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ))
  .add("invalid input", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.INPUT}
      value="desfero"
      helperText="It's an important information for us to provide the best user experience"
      errorMessage="User name already in use"
    />
  ))
  .add("disabled input", () => (
    <FieldLayout label="User name" type={EFieldType.INPUT} disabled={true} value="desfero" />
  ))
  .add("textarea ", () => (
    <FieldLayout
      label="User name"
      type={EFieldType.TEXT_AREA}
      placeholder="Lorem ipsum..."
      helperText="It's an important information for us to provide the best user experience"
    />
  ));
