import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Form, Formik } from "formik";
import { EtoTagWidget } from "./EtoTagWidget";

const formWrapper = (formState: any) => (Component: React.SFC) => () => (
  <Formik initialValues={formState} onSubmit={() => {}}>
    {() => (
      <Form>
        <Component />
      </Form>
    )}
  </Formik>
);

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
