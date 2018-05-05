// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PanelDark } from "./PanelDark";

storiesOf("PanelDark", module)
  .add("default", () => (
    <PanelDark headerText="header text">
      <p>So this is our dark panel. It can contain React.Nodes as children and two props:</p>
      <dl>
        <dt>headerText: string</dt>
        <dd>Title of panel it will be rendered in span element</dd>
        <dt>rightComponent: ReactNode</dt>
        <dd>Component that will be put in header on right side.</dd>
      </dl>
    </PanelDark>
  ))
  .add("with right component", () => (
    <PanelDark
      headerText="header text"
      rightComponent={
        <span style={{ height: "40px", backgroundColor: "red" }}>right component</span>
      }
    >
      <p>So this is our dark panel. It can contain React.Nodes as children and two props:</p>
      <dl>
        <dt>headerText: string</dt>
        <dd>Title of panel it will be rendered in span element</dd>
        <dt>rightComponent: ReactNode</dt>
        <dd>Component that will be put in header on right side.</dd>
      </dl>
    </PanelDark>
  ));
