import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTagWidget } from "./EtoTagWidget";

storiesOf("TagsFormWidget", module).add("default", () => (
  <EtoTagWidget
    selectedTagsLimit={5}
    options={["test", "haha", "boo", "stu", "lu"].map((word: string) => ({
      value: word,
      label: word,
    }))}
  />
));
