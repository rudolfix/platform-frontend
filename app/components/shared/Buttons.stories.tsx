import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button } from "./Buttons";

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
    <div style={{ "background-color": "black", padding: "20px" }}>
      <Button theme="t-white">primary</Button>
      <br />
      <Button theme="t-white" disabled>
        primary disabled
      </Button>
      <br />
      <Button svgIcon={icon} theme="t-white" iconPosition="icon-before">
        primary icon before text
      </Button>
      <br />
      <Button layout="secondary" theme="t-white">
        secondary
      </Button>
      <br />
      <Button layout="secondary" theme="t-white" disabled>
        secondary disabled
      </Button>
      <br />
      <Button layout="secondary" svgIcon={icon} theme="t-white" iconPosition="icon-before">
        secondary icon before text
      </Button>
      <br />
      <Button layout="secondary" svgIcon={icon} theme="t-white" iconPosition="icon-before" disabled>
        secondary icon before text disabled
      </Button>
    </div>
  ));
