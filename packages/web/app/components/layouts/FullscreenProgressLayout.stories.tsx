import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FullscreenProgressLayoutComponent } from "./FullscreenProgressLayout";

const buttonProps = {
  buttonText: "Lorem ipsum",
  buttonAction: action("BUTTON_ACTION"),
};

storiesOf("Templates|Layouts/FullscreenProgressLayout", module)
  .add("default", () => (
    <FullscreenProgressLayoutComponent userIsAuthorized={true}>
      Dummy content
    </FullscreenProgressLayoutComponent>
  ))
  .add("default with progress", () => (
    <FullscreenProgressLayoutComponent userIsAuthorized={true} progress={50}>
      Dummy content
    </FullscreenProgressLayoutComponent>
  ))
  .add("with action", () => (
    <FullscreenProgressLayoutComponent userIsAuthorized={true} buttonProps={buttonProps}>
      Dummy content
    </FullscreenProgressLayoutComponent>
  ))
  .add("with action and progress", () => (
    <FullscreenProgressLayoutComponent
      userIsAuthorized={true}
      progress={50}
      buttonProps={buttonProps}
    >
      Dummy content
    </FullscreenProgressLayoutComponent>
  ));
