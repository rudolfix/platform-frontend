import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FullscreenLayoutComponent } from "./FullscreenLayout";

const buttonProps = {
  buttonText: "Lorem ipsum",
  buttonAction: action("BUTTON_ACTION"),
};

storiesOf("Templates|Layouts/FullscreenLayout", module)
  .add("default", () => (
    <FullscreenLayoutComponent userIsAuthorized={true}>Dummy content</FullscreenLayoutComponent>
  ))
  .add("with action", () => (
    <FullscreenLayoutComponent buttonProps={buttonProps} userIsAuthorized={false}>
      Dummy content
    </FullscreenLayoutComponent>
  ));
