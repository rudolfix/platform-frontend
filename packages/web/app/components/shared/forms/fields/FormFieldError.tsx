import * as React from "react";

import { FormError } from "../layouts/FormError";
import { useFieldMeta } from "./utils";

export interface IProps {
  name: string;
  ignoreTouched?: boolean;
  className?: string;
  alignLeft?: boolean;
}

const FormFieldError: React.FunctionComponent<IProps> = ({
  name,
  ignoreTouched,
  className,
  alignLeft,
}) => {
  const { invalid, error } = useFieldMeta(name, { ignoreTouched: !!ignoreTouched });

  if (invalid && (typeof error === "string" || React.isValidElement(error))) {
    return <FormError name={name} message={error} className={className} alignLeft={alignLeft} />;
  }

  return null;
};

export { FormFieldError };
