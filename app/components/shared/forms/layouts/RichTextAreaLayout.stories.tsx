import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { RichTextAreaLayout } from "./RichTextAreaLayout";

const html = `
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      
      <p>Paragraph</p>
      
      <a href="https://platform.neufund.org">Neufund Platform</a>
      
      <strong>bold text</strong>
      
      <i>italic text</i>
      
      <ul>
        <li>unordered list 1</li>
        <li>unordered list 2</li>
      </ul> 
      
      <ol>
        <li>ordered list 1</li>
        <li>ordered list 2</li>
      </ol>
    `;

storiesOf("Atoms|RichTextAreaLayout", module)
  .add("default", () => <RichTextAreaLayout name="bmw" value={html} onChange={action("onClick")} />)
  .add("with placeholder", () => (
    <RichTextAreaLayout
      name="bmw"
      value={undefined}
      placeholder="Provide some text"
      onChange={action("onClick")}
    />
  ))
  .add("disabled", () => (
    <RichTextAreaLayout
      name="bmw"
      value={"This is a disabled text area"}
      disabled={true}
      onChange={action("onClick")}
    />
  ))
  .add("invalid", () => (
    <RichTextAreaLayout
      name="bmw"
      value={"This is a invalid text area"}
      invalid={true}
      onChange={action("onClick")}
    />
  ));
