import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTagWidget } from "./EtoTagWidget";

storiesOf("TagsFormWidget", module).add("default", () => (
  <EtoTagWidget
    selectedTagsLimit={5}
    options={["Science", "Technology", "Blockchain", "Medical", "Research"].map((word: string) => ({
      value: word,
      label: word,
    }))}
  />
));
