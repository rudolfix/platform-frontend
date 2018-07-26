import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DocumentLink } from "./DocumentLink";
import { InlineIcon } from "./InlineIcon";

import * as link_out from "../../assets/img/inline_icons/link_out.svg";

storiesOf("DocumentLink", module)
  .add("doc", () => <DocumentLink url="doc" name="foo" />)
  .add("pdf", () => <DocumentLink url="pdf" name="bar" />)
  .add("alt", () => (
    <DocumentLink url="pdf" name="bar" altIcon={<InlineIcon svgIcon={link_out} />} />
  ));
