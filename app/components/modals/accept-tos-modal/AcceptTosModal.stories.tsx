import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ModalComponentBody } from "../ModalComponentBody";
import { AcceptTosModalInner } from "./AcceptTosModal";

const props = {
  isOpen: true,
  onAccept: () => {},
  onDownloadTos: () => {},
  onLogout: () => {},
};

storiesOf("AcceptTosModal", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody>{story()}</ModalComponentBody>
    </div>
  ))
  .add("Accept Tos", () => <AcceptTosModalInner {...props} />);
