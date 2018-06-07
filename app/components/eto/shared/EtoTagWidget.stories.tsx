import { action, configureActions } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Form, Formik } from "formik";
import { formWrapper } from "../../shared/forms/formField/form-utils";
import { EtoTagWidget, generateTagOptions } from "./EtoTagWidget";

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

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
    <EtoTagWidget selectedTagsLimit={5} options={generateTagOptions(tagList)} name="tags" />
  )),
);
