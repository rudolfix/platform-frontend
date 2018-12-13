import { storiesOf } from "@storybook/react";
import * as React from "react";
import { withModalBody } from "../../../utils/storybookHelpers";
import { AcceptTosModalInner } from "./AcceptTosModal";

const props = {
  isOpen: true,
  onAccept: () => {},
  onDownloadTos: () => {},
  onLogout: () => {},
};

storiesOf("AcceptTosModal", module)
  .addDecorator(withModalBody())
  .add("Accept Tos", () => <AcceptTosModalInner {...props} />);
