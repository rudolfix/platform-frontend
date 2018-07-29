import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button, ButtonArrowRight } from "./Buttons";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";

storiesOf("Button", module)
  .add("primary", () => (
    <>
      <Button>primary</Button>
      <br />
      <Button disabled>primary disabled</Button>
    </>
  ))
  .add("secondary", () => (
    <>
      <Button layout="secondary">secondary</Button>
      <br />
      <Button layout="secondary" disabled>
        secondary disabled
      </Button>
    </>
  ))
  .add("with icons", () => (
    <>
      <Button layout="secondary" svgIcon={icon} iconPosition="icon-before">
        icon before text
      </Button>
      <br />
      <Button layout="secondary" svgIcon={icon} iconPosition="icon-after">
        icon after text
      </Button>
    </>
  ))
  .add("white theme", () => (
    <div>
      <Button theme="white">primary</Button>
      <br />
      <Button theme="white" disabled>
        primary disabled
      </Button>
      <br />
      <Button svgIcon={icon} theme="white" iconPosition="icon-before">
        primary icon before text
      </Button>
      <br />
      <Button layout="secondary" theme="white">
        secondary
      </Button>
      <br />
      <Button layout="secondary" theme="white" disabled>
        secondary disabled
      </Button>
      <br />
      <Button layout="secondary" svgIcon={icon} theme="white" iconPosition="icon-before">
        secondary icon before text
      </Button>
      <br />
      <Button layout="secondary" svgIcon={icon} theme="white" iconPosition="icon-before" disabled>
        secondary icon before text disabled
      </Button>
    </div>
  ))
  .add("loading", () => <Button isLoading>Primary</Button>);

storiesOf("ButtonArrowRight", module).add("primary", () => (
  <ButtonArrowRight>primary</ButtonArrowRight>
));
