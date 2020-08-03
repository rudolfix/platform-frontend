import { applyCharactersLimit, useFieldMeta } from "@neufund/design-system";
import { invariant } from "@neufund/shared-utils";
import cn from "classnames";
import { connect as formikConnect, Field, FieldProps } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Input } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { CommonHtmlProps, TFormikConnect, THocOuterProps, THocProps } from "../../../../types";
import { generateErrorId } from "../layouts/FormError";
import { isWysiwyg, withFormField } from "./utils";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  /**
   * @deprecated Use `Yup` max validation to keep schema related validation in one place
   */
  charactersLimit?: number;
  isWysiwyg?: boolean;
}

type TFieldGroupProps = IFieldGroup & CommonHtmlProps;

const RichTextAreaLayout = React.lazy(() =>
  import("../layouts/RichTextAreaLayout").then(imp => ({ default: imp.RichTextAreaLayout })),
);

const RichTextArea: React.FunctionComponent<TFieldGroupProps & TFormikConnect> = ({
  disabled,
  placeholder,
  name,
  className,
  charactersLimit,
}) => {
  if (process.env.NODE_ENV === "development") {
    invariant(
      charactersLimit === undefined,
      "`charactersLimit` prop is deprecated and should not be used anymore for rich text editor",
    );
  }

  const [isUploading, setIsUploading] = React.useState(false);

  const onLoadingData = (loading: boolean) => {
    setIsUploading(loading);
  };

  const { invalid, changeValue } = useFieldMeta(name);

  const validate = () => {
    if (isUploading) {
      return <FormattedMessage id="shared.dropzone.upload.image.errors.is-uploading" />;
    }

    return undefined;
  };

  return (
    <Field name={name} validate={validate}>
      {({ field }: FieldProps) => (
        <RichTextAreaLayout
          invalid={invalid}
          name={name}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          value={field.value}
          onLoadingData={onLoadingData}
          onChange={changeValue}
        />
      )}
    </Field>
  );
};

const TextArea: React.FunctionComponent<TFieldGroupProps & TFormikConnect> = ({
  disabled,
  placeholder,
  name,
  className,
  charactersLimit,
}) => {
  const { invalid, changeValue } = useFieldMeta(name);

  return (
    <Field name={name}>
      {({ field }: FieldProps) => (
        <Input
          {...field}
          type="textarea"
          aria-describedby={generateErrorId(name)}
          aria-invalid={invalid}
          invalid={invalid}
          disabled={disabled}
          value={field.value === undefined ? "" : field.value}
          placeholder={placeholder}
          className={cn(className, styles.inputField)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            changeValue(applyCharactersLimit(e.target.value, charactersLimit));
          }}
        />
      )}
    </Field>
  );
};

export const FormTextArea = compose<
  TFieldGroupProps & TFormikConnect & THocProps<typeof withFormField>,
  TFieldGroupProps & THocOuterProps<typeof withFormField>
>(
  withFormField(),
  formikConnect,
  branch<IFieldGroup & TFormikConnect>(
    props => !!props.isWysiwyg || isWysiwyg(props.formik.validationSchema, props.name),
    renderComponent(RichTextArea),
  ),
)(TextArea);
