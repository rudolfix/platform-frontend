import { Field, FieldAttributes, FieldProps, Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Button, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";

interface IFormValues {
  firstName: string;
  secondName: string;
  email: string;
}

interface IFieldGroup {
  label: string;
  placeholder?: string;
  touched: any;
  errors: any;
}

type FieldGroupProps = IFieldGroup & FieldAttributes;

const ExtendedField: React.SFC<FieldGroupProps> = ({ name, ...props }) => {
  return (
    <FormGroup>
      <Label for={name}>{props.label}</Label>
      <Field
        name={name}
        render={({ field }: FieldProps) => <Input {...field} placeholder={props.placeholder} />}
      />
      {props.touched[name] &&
        props.errors[name] && <span className="text-danger">{props.errors[name]}</span>}
    </FormGroup>
  );
};

export const KycFormComponent: React.SFC<FormikProps<IFormValues>> = ({
  touched,
  errors,
  isValid,
}) => {
  return (
    <Form>
      <ExtendedField label="First name" name="firstName" touched={touched} errors={errors} />
      <ExtendedField label="Second name" name="secondName" touched={touched} errors={errors} />
      <ExtendedField
        label="Email"
        name="email"
        placeholder="someone@example.com"
        touched={touched}
        errors={errors}
      />
      <Button color="primary" type="submit" disabled={!isValid}>
        Submit
      </Button>
    </Form>
  );
};

const KycForm = withFormik<{}, IFormValues>({
  displayName: "kyc_form",
  // it turns out that this is needed so initial value is ""
  mapPropsToValues: () => {
    return {
      firstName: "",
      secondName: "",
      email: "",
    };
  },
  handleSubmit: values => {
    // tslint:disable-next-line
    console.log("values", values);
  },
  validationSchema: Yup.object().shape({
    firstName: Yup.string()
      .required()
      .min(4, "Must be longer than 4")
      .max(8, "Must be shorter than 8"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required!"),
  }),
})(KycFormComponent);

export const Kyc = () => (
  <Container className="mt-3">
    <Row>
      <Col>
        <h2>KYC:</h2>
      </Col>
    </Row>
    <Row>
      <Col>
        <KycForm />
      </Col>
    </Row>
  </Container>
);
