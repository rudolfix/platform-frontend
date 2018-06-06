import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { formWrapper } from "../../shared/forms/formField/form-utils";
import { EtoTagWidget } from "./EtoTagWidget";

storiesOf("TagsFormWidget", module).add(
  "Empty",
  formWrapper({ tags: [] })(() => (
    <EtoTagWidget
      selectedTagsLimit={5}
      options={["Science", "Technology", "Blockchain", "Medical", "Research"].map(
        (word: string) => ({
          value: word,
          label: word,
        }),
      )}
      name="tags"
    />
  )),
);
