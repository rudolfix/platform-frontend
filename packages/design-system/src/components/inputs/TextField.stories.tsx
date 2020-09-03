import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";
import { IntlProvider } from "react-intl";
import * as Yup from "yup";

import { TextField } from "./TextField";

const schema = Yup.object().shape({
  field1: Yup.string().required("Field is required"),
  field2: Yup.string(),
  field3: Yup.string(),
  field4: Yup.number().typeError("This is not a number"),
  field5: Yup.string(),
  field6: Yup.number().typeError("This is not a number"),
  field7: Yup.string(),
  field8: Yup.string().required("Field is required"),
  field9: Yup.string(),
});

let isTouched = false;

storiesOf("NDS|Molecules/Inputs", module).add("TextField", () => (
  <IntlProvider>
    <Formik
      onSubmit={() => {}}
      initialValues={{
        field1: "Initial value",
        field4: "number required",
        field6: "number required",
      }}
      validationSchema={schema}
    >
      {({ setFieldTouched }) => {
        // initialTouched is not supported in a current version of Formik
        // make it asynchronously set as touched after render has been done
        // also, Formik is performing full rerender while changing touched state
        // to avoid memory leak in storybook we invoke this once
        if (!isTouched) {
          setTimeout(() => {
            setFieldTouched("field4");
            setFieldTouched("field6");
            isTouched = true;
          }, 0);
        }

        return (
          <form style={{ width: "400px", padding: "25px" }}>
            <TextField label="Required" name="field1" placeholder="Input" />
            <TextField label="Focused" name="field2" placeholder="Input" autoFocus={true} />
            <TextField label="Optional" name="field3" placeholder="Input" />
            <TextField label="Invalid" name="field4" placeholder="Input" />
            <TextField
              label="With description"
              name="field5"
              description="Lorem Ipsum Dolor..."
              placeholder="Input"
            />
            <TextField
              label="Invalid With description"
              name="field6"
              description="Lorem Ipsum Dolor..."
              placeholder="Input"
            />
            <TextField label="Disabled" name="field7" disabled={true} placeholder="Input" />
            <TextField label="Password" type="password" name="field8" placeholder="Password" />
            <TextField label="Small Width" name="field9" placeholder="No." smallWidth />
          </form>
        );
      }}
    </Formik>
  </IntlProvider>
));
