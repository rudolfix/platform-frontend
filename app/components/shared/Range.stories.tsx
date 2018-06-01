import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { FormRange } from "./Range";

storiesOf("Range", module)
  .add("default", () => (
    <Formik initialValues={{ name: 10 }} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormRange name="name" min={10} max={20} unit="%" />
        </Form>
      )}
    </Formik>
  ))
  .add("with default value", () => (
    <Formik initialValues={{ name: 0 }} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormRange name="name" min={0} max={100} unit="%" />
        </Form>
      )}
    </Formik>
  ))
  .add("with different step", () => (
    <Formik initialValues={{ name: 10 }} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormRange name="name" min={0} max={12} step={3} unit="px" />
        </Form>
      )}
    </Formik>
  ))
  .add("with different units", () => (
    <Formik initialValues={{ name: 1 }} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormRange name="name" min={1} max={5} unitMin="week" unitMax="weeks" />
        </Form>
      )}
    </Formik>
  ))
  .add("without unit", () => (
    <Formik initialValues={{ name: 10 }} onSubmit={() => {}}>
      {() => (
        <Form>
          <FormRange name="name" min={0} max={10} step={2} />
        </Form>
      )}
    </Formik>
  ));
