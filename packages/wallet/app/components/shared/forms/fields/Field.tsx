import { FieldHookConfig, useField } from "formik";
import React from "react";

import { FieldLayout } from "../layouts/FieldLayout";

type TFieldLayoutProps = React.ComponentProps<typeof FieldLayout>;
type TExternalProps = {} & TFieldLayoutProps & FieldHookConfig<any>;

const Field: React.FunctionComponent<TExternalProps> = props => {
  const [field, meta] = useField(props);

  return (
    <FieldLayout
      onChangeText={field.onChange(props.name)}
      onBlur={field.onBlur(props.name)}
      value={field.value}
      errorMessage={(meta.touched && meta.error) || undefined}
      {...props}
    />
  );
};

export { Field };
