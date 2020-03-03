import { storiesOf } from "@storybook/react";
import * as React from "react";
import withFormik from "storybook-formik";

import { EtoTagWidget, generateTagOptions } from "./EtoTagWidget.unsafe";

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

storiesOf("TagsFormWidget", module)
  .addDecorator(withFormik)
  .add(
    "Empty",
    () => <EtoTagWidget selectedTagsLimit={5} options={generateTagOptions(tagList)} name="tags" />,
    {
      formik: {
        initialValues: { tags: [] },
      },
    },
  )
  .add(
    "Already Tags",
    () => <EtoTagWidget selectedTagsLimit={5} options={generateTagOptions(tagList)} name="tags" />,
    {
      formik: {
        initialValues: { tags: ["Fintech", "Black Magic"] },
      },
    },
  );
