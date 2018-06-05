import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTagWidget } from "./EtoTagWidget";

storiesOf("TagsFormWidget", module)
  .add("Empty", () => (
    <EtoTagWidget
      selectedTagsLimit={5}
      options={["Science", "Technology", "Blockchain", "Medical", "Research"].map(
        (word: string) => ({
          value: word,
          label: word,
        }),
      )}
    />
  ))
  .add("With tags", () => (
    <EtoTagWidget
      selectedTagsLimit={5}
      selectedTags={["tag1", "Custom Tag"]}
      options={["Science", "Technology", "Blockchain", "Medical", "Research"].map(
        (word: string) => ({
          value: word,
          label: word,
        }),
      )}
    />
  ))
  .add("When limit reached", () => (
    <EtoTagWidget
      selectedTagsLimit={2}
      selectedTags={["tag1", "Custom Tag"]}
      options={["Science", "Technology", "Blockchain", "Medical", "Research"].map(
        (word: string) => ({
          value: word,
          label: word,
        }),
      )}
    />
  ));
