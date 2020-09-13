import { storiesOf } from "@storybook/react";
import * as React from "react";
import { action } from "@storybook/addon-actions";

import { UploadedFiles } from "./UploadedFiles";

const files = [
  {
    id: "1234",
    fileName: "Fifth Force GmbH Series C fundraising information.pdf",
  },
];

storiesOf("Upload/UploadedFiles", module).add("default", () => (
  <UploadedFiles files={files} onDelete={action("onDeleteClick")} />
));
