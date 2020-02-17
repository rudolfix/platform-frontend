import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { FooterButtons } from "./FooterButtons";

storiesOf("molecules|KYC/FooterButtons", module)
  .add("default", () => (
    <FooterButtons
      onBack={action("ON_BACK")}
      onContinue={action("ON_CONTINUE")}
      continueButtonId=""
    />
  ))
  .add("skip", () => (
    <FooterButtons
      onBack={action("ON_BACK")}
      onContinue={action("ON_CONTINUE")}
      continueButtonId=""
      skip
    />
  ))
  .add("disabled", () => (
    <FooterButtons
      onBack={action("ON_BACK")}
      onContinue={action("ON_CONTINUE")}
      continueButtonId=""
      continueDisabled
    />
  ));
